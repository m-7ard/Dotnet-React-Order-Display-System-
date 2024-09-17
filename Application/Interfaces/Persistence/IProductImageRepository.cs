using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IProductImageRepository
{
    Task<ProductImage> CreateAsync(ProductImage productImage);
    Task<ProductImage?> GetByFileNameAsync(string fileName);
    Task<ProductImage> AssignToProductAsync(int productId, int productImageId);
    Task<List<ProductImage>> FilterByProductIdAsync(int productId);
    Task DeleteByFileNameAsync(string fileName);
}