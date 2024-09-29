using Application.Interfaces.Persistence;
using Domain.DomainFactories;
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

    public async Task<Product?> GetByIdAsync(int id)
    {
        var productDbEntity = await _dbContext.Product
            .Include(d => d.Images)
            .SingleOrDefaultAsync(d => d.Id == id);
        return productDbEntity is null ? null : ProductMapper.FromDbEntityToDomain(productDbEntity);
    }

    public async Task<List<Product>> FindAllAsync(int? id, string? name, decimal? minPrice, decimal? maxPrice, string? description, DateTime? createdBefore, DateTime? createdAfter)
    {
        IQueryable<ProductDbEntity> query = _dbContext.Product.Include(d => d.Images);

        if (id is not null)
        {
            query = query.Where(item => item.Id == id);
        }

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(item => item.Name.Contains(name));
        }

        if (!string.IsNullOrEmpty(description))
        {
            query = query.Where(item => item.Description.Contains(description));
        }

        if (minPrice.HasValue)
        {
            query = query.Where(item => item.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(item => item.Price <= maxPrice.Value);
        }

        if (createdAfter.HasValue)
        {
            query = query.Where(item => item.DateCreated >= createdAfter);
        }

        if (createdBefore.HasValue)
        {
            query = query.Where(item => item.DateCreated <= createdBefore);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(item => item.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(item => item.Price <= maxPrice.Value);
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

    public async Task DeleteByIdAsync(int id)
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