using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IProductRepository
{
    Task<Product> CreateAsync(Product product);
    Task<Product?> GetByIdAsync(int id);
    Task<List<Product>> FindAllAsync(string? name, float? minPrice, float? maxPrice, string? description, DateTime? createdBefore, DateTime? createdAfter);
}