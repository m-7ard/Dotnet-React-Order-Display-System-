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
        var productDbEntity = ProductMapper.DomainToDbEntity(product);
        _dbContext.Add(productDbEntity);
        await _dbContext.SaveChangesAsync();
        return ProductMapper.DbEntityToDomain(productDbEntity);
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        var productDbEntity = await _dbContext.Product
            .Include(d => d.Images)
            .SingleOrDefaultAsync(d => d.Id == id);
        return productDbEntity is null ? null : ProductMapper.DbEntityToDomain(productDbEntity);
    }

    public async Task<List<Product>> FindAllAsync(string? name, float? minPrice, float? maxPrice, string? description, DateTime? createdBefore, DateTime? createdAfter)
    {
        IQueryable<ProductDbEntity> query = _dbContext.Product.Include(d => d.Images);

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(item => item.Name.Contains(name));
        }

        if (!string.IsNullOrEmpty(description))
        {
            query = query.Where(item => item.Name.Contains(description));
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
        return dbProducts.Select(ProductMapper.DbEntityToDomain).ToList();
    }

    public async Task UpdateAsync(Product product)
    {
        var currentEntity = await _dbContext.Product
            .Include(d => d.Images)
            .SingleAsync(d => d.Id == product.Id);
        var updatedEntity = ProductMapper.DomainToDbEntity(product);

        foreach (var oldImage in currentEntity.Images)
        {
            if (updatedEntity.Images.Find(d => d.Id == oldImage.Id) is null)
            {
                _dbContext.Remove(oldImage);
            }
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