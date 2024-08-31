using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IProductRepository
{
    Task<Product> CreateAsync(Product product);
}