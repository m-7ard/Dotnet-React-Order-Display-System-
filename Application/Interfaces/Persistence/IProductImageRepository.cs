using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IProductImageRepository
{
    Task<ProductImage> CreateAsync(ProductImage productImage);
    Task<ProductImage?> GetByFileNameAsync(string fileName);
    Task<ProductImage> AssignToProduct(int productId, int productImageId);
}