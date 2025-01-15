using Application.Contracts.Criteria;
using Domain.Models;
using Domain.ValueObjects.Product;

namespace Application.Interfaces.Persistence;

public interface IProductRepository
{
    Task<Product> CreateAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteByIdAsync(ProductId id);
    Task<Product?> GetByIdAsync(ProductId id);
    Task<List<Product>> FilterAllAsync(FilterProductsCriteria criteria);
}