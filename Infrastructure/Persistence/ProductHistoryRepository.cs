using Application.Interfaces.Persistence;
using Domain.Models;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ProductHistoryRespository : IProductHistoryRepository
{
    private readonly SimpleProductOrderServiceDbContext _simpleProductOrderServiceDbContext;

    public ProductHistoryRespository(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _simpleProductOrderServiceDbContext = simpleProductOrderServiceDbContext;
    }

    public async Task<ProductHistory> CreateAsync(ProductHistory productHistory)
    {
        var productHistoryDbEntity = ProductHistoryMapper.ToDbModel(productHistory);
        _simpleProductOrderServiceDbContext.ProductHistory.Add(productHistoryDbEntity);
        await _simpleProductOrderServiceDbContext.SaveChangesAsync();
        return ProductHistoryMapper.ToDomain(productHistoryDbEntity);
    }

    public async Task<ProductHistory?> GetLatestByProductIdAsync(int id)
    {
        var productHistoryDbEntity = await _simpleProductOrderServiceDbContext.ProductHistory.OrderByDescending(d => d.ValidFrom).FirstOrDefaultAsync(d => d.ProductId == id && d.ValidFrom > d.ValidTo);
        return productHistoryDbEntity is null ? null : ProductHistoryMapper.ToDomain(productHistoryDbEntity);
    }

    public async Task<ProductHistory?> GetByIdAsync(int id)
    {
        var productHistoryDbEntity = await _simpleProductOrderServiceDbContext.ProductHistory.FirstOrDefaultAsync(d => d.ProductId == id);
        return productHistoryDbEntity is null ? null : ProductHistoryMapper.ToDomain(productHistoryDbEntity);
    }
}