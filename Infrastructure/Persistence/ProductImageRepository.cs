using Application.Interfaces.Persistence;
using Domain.Models;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ProductImageRepository : IProductImageRepository
{
    private readonly SimpleProductOrderServiceDbContext _dbContext;

    public ProductImageRepository(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _dbContext = simpleProductOrderServiceDbContext;
    }

    public async Task<ProductImage> CreateAsync(ProductImage productImage)
    {
        var dbProductImage = ProductImageMapper.ToDbModel(productImage);
        _dbContext.ProductImage.Add(dbProductImage);
        await _dbContext.SaveChangesAsync();
        return ProductImageMapper.ToDomain(dbProductImage);
    }

    public async Task<ProductImage?> GetByFileNameAsync(string fileName)
    {
        var dbProductImage = await _dbContext.ProductImage.FirstOrDefaultAsync(d => d.FileName == fileName);
        return dbProductImage is null ? null : ProductImageMapper.ToDomain(dbProductImage);
    }

    public async Task<ProductImage> AssignToProductAsync(int productId, int productImageId)
    {
        var dbProductImage = await _dbContext.ProductImage.SingleAsync(d => d.Id == productImageId);
        dbProductImage.ProductId = productId;
        await _dbContext.SaveChangesAsync();
        return ProductImageMapper.ToDomain(dbProductImage);
    }

    public async Task<List<ProductImage>> FilterByProductIdAsync(int productId)
    {
        var dbProductImages = await _dbContext.ProductImage.Where(d => d.ProductId == productId).ToListAsync();
        return dbProductImages.Select(ProductImageMapper.ToDomain).ToList();
    }

    public async Task DeleteByFileNameAsync(string fileName)
    {
        var dbProductImage = await _dbContext.ProductImage.SingleAsync(d => d.FileName == fileName);
        _dbContext.Remove(dbProductImage);
        await _dbContext.SaveChangesAsync();
    }
}