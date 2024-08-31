using Application.Interfaces.Persistence;
using Domain.Models;
using Infrastructure.Mappers;

namespace Infrastructure.Persistence;

public class ProductRepository : IProductRepository
{
    private readonly SimpleProductOrderServiceDbContext _productApiDbContext;

    public ProductRepository(SimpleProductOrderServiceDbContext productApiDbContext)
    {
        _productApiDbContext = productApiDbContext;
    }

    public async Task<Product> CreateAsync(Product product)
    {
        var productDbEntity = ProductMapper.ToDbEntity(product);
        _productApiDbContext.Add(productDbEntity);
        await _productApiDbContext.SaveChangesAsync();
        return ProductMapper.ToDomain(productDbEntity);
    }
}