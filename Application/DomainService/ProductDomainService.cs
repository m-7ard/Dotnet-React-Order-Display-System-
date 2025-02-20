using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Models;
using Domain.ValueObjects.Product;
using OneOf;

namespace Application.DomainService;

public class ProductDomainService : IProductDomainService
{
    private readonly IProductRepository _productRepository;

    public ProductDomainService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<OneOf<Product, string>> GetProductById(Guid id)
    {
        var canCreateProductId = ProductId.TryCreate(id);
        if (canCreateProductId.IsT1) return canCreateProductId.AsT1;
        
        var productId = canCreateProductId.AsT0;

        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null) return $"Product of Id \"{productId}\" does not exist.";

        return product;
    }
}