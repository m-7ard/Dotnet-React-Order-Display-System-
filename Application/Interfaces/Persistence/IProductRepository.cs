using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IProductRepository
{
    Task<Product> CreateAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteByIdAsync(int id);
    Task<Product?> GetByIdAsync(int id);
    Task<List<Product>> FindAllAsync(
        int? id, 
        string? name, 
        decimal? minPrice, 
        decimal? maxPrice, 
        string? description, 
        DateTime? createdBefore, 
        DateTime? createdAfter,
        Tuple<string, bool>? orderBy);
}