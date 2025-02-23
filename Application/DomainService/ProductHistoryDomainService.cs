using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Models;
using OneOf;

namespace Application.DomainService;

public class ProductHistoryDomainService : IProductHistoryDomainService
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ProductHistoryDomainService(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<ProductHistory, string>> GetLatestProductHistoryForProduct(Product product)
    {
        var productHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);
        if (productHistory is null) return $"No latest Product History for Product of id \"{product.Id}\".";

        return productHistory;
    }
}