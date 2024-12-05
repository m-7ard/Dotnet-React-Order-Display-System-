using Application.Contracts.Criteria;
using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IProductRepository
{
    Task<Product> CreateAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteByIdAsync(Guid id);
    Task<Product?> GetByIdAsync(Guid id);
    Task<List<Product>> FindAllAsync(FilterProductsCriteria criteria);
}