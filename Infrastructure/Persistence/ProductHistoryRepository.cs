using System.Linq.Expressions;
using Application.Contracts.Criteria;
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

    public async Task<ProductHistory?> GetLatestByProductIdAsync(Guid id)
    {
        var productHistoryDbEntity = await _dbContext.ProductHistory.OrderByDescending(d => d.ValidFrom).FirstOrDefaultAsync(d => d.ProductId == id && d.ValidFrom > d.ValidTo);
        return productHistoryDbEntity is null ? null : ProductHistoryMapper.ToDomain(productHistoryDbEntity);
    }

    public async Task<ProductHistory?> GetByIdAsync(Guid id)
    {
        var productHistoryDbEntity = await _dbContext.ProductHistory.FirstOrDefaultAsync(d => d.Id == id);
        return productHistoryDbEntity is null ? null : ProductHistoryMapper.ToDomain(productHistoryDbEntity);
    }

    public async Task<List<ProductHistory>> FindAllAsync(FilterProductHistoriesCriteria criteria)
    {
        IQueryable<ProductHistoryDbEntity> query = _dbContext.ProductHistory;
        if (!string.IsNullOrEmpty(criteria.Name))
        {
            query = query.Where(item => item.Name.Contains(criteria.Name));
        }

        if (!string.IsNullOrEmpty(criteria.Description))
        {
            query = query.Where(item => item.Description.Contains(criteria.Description));
        }

        if (criteria.MinPrice is not null)
        {
            query = query.Where(item => item.Price >= criteria.MinPrice.Value);
        }

        if (criteria.MaxPrice is not null)
        {
            query = query.Where(item => item.Price <= criteria.MaxPrice.Value);
        }

        if (criteria.ValidFrom is not null)
        {
            query = query.Where(item => item.ValidFrom >= criteria.ValidFrom);
        }

        if (criteria.ValidTo is not null)
        {
            query = query.Where(item => item.ValidTo <= criteria.ValidTo);
        }

        if (criteria.MinPrice is not null)
        {
            query = query.Where(item => item.Price >= criteria.MinPrice.Value);
        }

        if (criteria.MaxPrice is not null)
        {
            query = query.Where(item => item.Price <= criteria.MaxPrice.Value);
        }

        if (criteria.ProductId is not null)
        {
            query = query.Where(item => item.OriginalProductId == criteria.ProductId);
        }

        if (criteria.OrderBy is not null)
        {
            Dictionary<string, Expression<Func<ProductHistoryDbEntity, object>>> fieldMappings = new()
            {
                { "Price", p => p.Price },
                { "ValidFrom", p => p.ValidFrom },
                { "OriginalProductId", p => p.OriginalProductId }
            };

            if (fieldMappings.TryGetValue(criteria.OrderBy.Item1, out var orderByExpression))
            {
                query = criteria.OrderBy.Item2 ? query.OrderBy(orderByExpression) : query.OrderByDescending(orderByExpression);
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