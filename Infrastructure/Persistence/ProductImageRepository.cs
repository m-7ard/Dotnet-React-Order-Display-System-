using Application.Interfaces.Persistence;
using Domain.Models;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ProductImageRepository : IProductImageRepository
{
    private readonly SimpleProductOrderServiceDbContext _simpleProductOrderServiceDbContext;

    public ProductImageRepository(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _simpleProductOrderServiceDbContext = simpleProductOrderServiceDbContext;
    }

    public async Task<ProductImage> CreateAsync(ProductImage productImage)
    {
        var dbProductImage = ProductImageMapper.ToDbModel(productImage);
        _simpleProductOrderServiceDbContext.ProductImage.Add(dbProductImage);
        await _simpleProductOrderServiceDbContext.SaveChangesAsync();
        return ProductImageMapper.ToDomain(dbProductImage);
    }

    public async Task<ProductImage?> GetByFileNameAsync(string fileName)
    {
        var dbProductImage = await _simpleProductOrderServiceDbContext.ProductImage.FirstOrDefaultAsync(d => d.FileName == fileName);
        return dbProductImage is null ? null : ProductImageMapper.ToDomain(dbProductImage);
    }

    public async Task<ProductImage> AssignToProduct(int productId, int productImageId)
    {
        var dbProductImage = await _simpleProductOrderServiceDbContext.ProductImage.SingleAsync(d => d.Id == productImageId);
        dbProductImage.ProductId = productId;
        await _simpleProductOrderServiceDbContext.SaveChangesAsync();
        return ProductImageMapper.ToDomain(dbProductImage);
    }
}