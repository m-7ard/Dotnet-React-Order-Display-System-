using System.Linq.Expressions;
using Application.Contracts.Criteria;
using Application.Interfaces.Persistence;
using Domain.Models;
using Infrastructure.DbEntities;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ProductRepository : IProductRepository
{
    private readonly SimpleProductOrderServiceDbContext _dbContext;

    public ProductRepository(SimpleProductOrderServiceDbContext productApiDbContext)
    {
        _dbContext = productApiDbContext;
    }

    public async Task<Product> CreateAsync(Product product)
    {
        var productDbEntity = ProductMapper.FromDomainToDbEntity(product);
        _dbContext.Add(productDbEntity);
        await _dbContext.SaveChangesAsync();
        return ProductMapper.FromDbEntityToDomain(productDbEntity);
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        var productDbEntity = await _dbContext.Product
            .Include(d => d.Images)
            .SingleOrDefaultAsync(d => d.Id == id);
        return productDbEntity is null ? null : ProductMapper.FromDbEntityToDomain(productDbEntity);
    }

    public async Task<List<Product>> FindAllAsync(FilterProductsCriteria criteria)
    {
        IQueryable<ProductDbEntity> query = _dbContext.Product.Include(d => d.Images);
        if (criteria.Id is not null)
        {
            query = query.Where(item => item.Id == criteria.Id);
        }

        if (!string.IsNullOrEmpty(criteria.Name))
        {
            query = query.Where(item => item.Name.Contains(criteria.Name));
        }

        if (!string.IsNullOrEmpty(criteria.Description))
        {
            query = query.Where(item => item.Description.Contains(criteria.Description));
        }

        if (criteria.MinPrice.HasValue)
        {
            query = query.Where(item => item.Price >= criteria.MinPrice.Value);
        }

        if (criteria.MaxPrice.HasValue)
        {
            query = query.Where(item => item.Price <= criteria.MaxPrice.Value);
        }

        if (criteria.CreatedAfter.HasValue)
        {
            query = query.Where(item => item.DateCreated >= criteria.CreatedAfter);
        }

        if (criteria.CreatedBefore.HasValue)
        {
            query = query.Where(item => item.DateCreated <= criteria.CreatedBefore);
        }

        if (criteria.OrderBy is not null)
        {
            Dictionary<string, Expression<Func<ProductDbEntity, object>>> fieldMappings = new()
            {
                { "Price", p => p.Price },
                { "DateCreated", p => p.DateCreated },
            };

            if (fieldMappings.TryGetValue(criteria.OrderBy.Item1, out var orderByExpression))
            {
                query = criteria.OrderBy.Item2 
                    ? query.OrderBy(orderByExpression) 
                    : query.OrderByDescending(orderByExpression);
            }
        }
        
        var dbProducts = await query.ToListAsync();
        return dbProducts.Select(ProductMapper.FromDbEntityToDomain).ToList();
    }

    public async Task UpdateAsync(Product product)
    {
        var currentEntity = await _dbContext.Product
            .Include(d => d.Images)
            .SingleAsync(d => d.Id == product.Id);

        var updatedEntity = ProductMapper.FromDomainToDbEntity(product);

        var removedImages = currentEntity.Images
            .Where(oldImage => !updatedEntity.Images.Any(newImage => newImage.Id == oldImage.Id))
            .ToList();
        _dbContext.ProductImage.RemoveRange(removedImages);
        
        var newImages = updatedEntity.Images.Where(image => !currentEntity.Images.Exists(other => other.FileName == image.FileName));
        foreach (var image in newImages)
        {
            image.ProductId = currentEntity.Id;
            _dbContext.ProductImage.Add(image);
        }

        _dbContext.Entry(currentEntity).CurrentValues.SetValues(updatedEntity);

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteByIdAsync(Guid id)
    {
        var entity = await _dbContext.Product
            .Include(d => d.Images)
            .SingleAsync(d => d.Id == id);

        foreach (var image in entity.Images)
        {
            _dbContext.Remove(image);
        }

        _dbContext.Remove(entity);
        await _dbContext.SaveChangesAsync();
    }
}