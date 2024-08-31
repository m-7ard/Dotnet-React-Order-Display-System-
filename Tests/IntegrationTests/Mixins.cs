using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Infrastructure;
using Infrastructure.Persistence;

namespace Tests.IntegrationTests;

public class Mixins
{
    private readonly SimpleProductOrderServiceDbContext _simpleProductOrderServiceDbContexts;
    private readonly IProductRepository _productRepository;

    public Mixins(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _simpleProductOrderServiceDbContexts = simpleProductOrderServiceDbContext;
        _productRepository = new ProductRepository(_simpleProductOrderServiceDbContexts);
    }

    public async Task<Product> CreateProduct(string name)
    {
        var product = ProductFactory.BuildNewProduct(
            name: name
        );
        return await _productRepository.CreateAsync(product);
    }
}