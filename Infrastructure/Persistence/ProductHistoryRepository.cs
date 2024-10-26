using System.Linq.Expressions;
using Application.Interfaces.Persistence;
using Domain.Models;
using Infrastructure.DbEntities;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ProductHistoryRespository : IProductHistoryRepository
{
    private readonly SimpleProductOrderServiceDbContext _dbContext;

    public ProductHistoryRespository(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _dbContext = simpleProductOrderServiceDbContext;
    }

    public async Task<ProductHistory> CreateAsync(ProductHistory productHistory)
    {
        var productHistoryDbEntity = ProductHistoryMapper.ToDbModel(productHistory);
        _dbContext.ProductHistory.Add(productHistoryDbEntity);
        await _dbContext.SaveChangesAsync();
        return ProductHistoryMapper.ToDomain(productHistoryDbEntity);
    }

    public async Task<ProductHistory?> GetLatestByProductIdAsync(int id)
    {
        var productHistoryDbEntity = await _dbContext.ProductHistory.OrderByDescending(d => d.ValidFrom).FirstOrDefaultAsync(d => d.ProductId == id && d.ValidFrom > d.ValidTo);
        return productHistoryDbEntity is null ? null : ProductHistoryMapper.ToDomain(productHistoryDbEntity);
    }

    public async Task<ProductHistory?> GetByIdAsync(int id)
    {
        var productHistoryDbEntity = await _dbContext.ProductHistory.FirstOrDefaultAsync(d => d.Id == id);
        return productHistoryDbEntity is null ? null : ProductHistoryMapper.ToDomain(productHistoryDbEntity);
    }

    public async Task<List<ProductHistory>> FindAllAsync(
        string? name,
        decimal? minPrice,
        decimal? maxPrice,
        string? description,
        DateTime? validFrom,
        DateTime? validTo,
        int? productId,
        Tuple<string, bool>? orderBy)
    {
        IQueryable<ProductHistoryDbEntity> query = _dbContext.ProductHistory;

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(item => item.Name.Contains(name));
        }

        if (!string.IsNullOrEmpty(description))
        {
            query = query.Where(item => item.Description.Contains(description));
        }

        if (minPrice is not null)
        {
            query = query.Where(item => item.Price >= minPrice.Value);
        }

        if (maxPrice is not null)
        {
            query = query.Where(item => item.Price <= maxPrice.Value);
        }

        if (validFrom is not null)
        {
            query = query.Where(item => item.ValidFrom >= validFrom);
        }

        if (validTo is not null)
        {
            query = query.Where(item => item.ValidTo <= validTo);
        }

        if (minPrice is not null)
        {
            query = query.Where(item => item.Price >= minPrice.Value);
        }

        if (maxPrice is not null)
        {
            query = query.Where(item => item.Price <= maxPrice.Value);
        }

        if (productId is not null)
        {
            query = query.Where(item => item.OriginalProductId == productId);
        }

        if (orderBy is not null)
        {
            Dictionary<string, Expression<Func<ProductHistoryDbEntity, object>>> fieldMappings = new()
            {
                { "Price", p => p.Price },
                { "ValidFrom", p => p.ValidFrom },
                { "OriginalProductId", p => p.OriginalProductId }
            };

            if (fieldMappings.TryGetValue(orderBy.Item1, out var orderByExpression))
            {
                query = orderBy.Item2 ? query.OrderBy(orderByExpression) : query.OrderByDescending(orderByExpression);
            }
        }

        var dbProducts = await query.ToListAsync();
        return dbProducts.Select(ProductHistoryMapper.ToDomain).ToList();
    }

    public async Task UpdateAsync(ProductHistory productHistory)
    {
        var currentEntity = await _dbContext.ProductHistory.SingleAsync(d => d.Id == productHistory.Id);

        var updatedEntity = ProductHistoryMapper.ToDbModel(productHistory);
        _dbContext.Entry(currentEntity).CurrentValues.SetValues(updatedEntity);

        await _dbContext.SaveChangesAsync();
    }
}