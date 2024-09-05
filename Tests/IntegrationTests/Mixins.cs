using Application.Common;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Infrastructure;
using Infrastructure.Persistence;

namespace Tests.IntegrationTests;

public class Mixins
{
    private readonly SimpleProductOrderServiceDbContext _simpleProductOrderServiceDbContexts;
    private readonly IProductRepository _productRepository;
    private readonly IProductImageRepository _productImageRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;

    public Mixins(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _simpleProductOrderServiceDbContexts = simpleProductOrderServiceDbContext;
        _productRepository = new ProductRepository(_simpleProductOrderServiceDbContexts);
        _productImageRepository = new ProductImageRepository(_simpleProductOrderServiceDbContexts);
        _productHistoryRepository = new ProductHistoryRespository(_simpleProductOrderServiceDbContexts);
    }

    public async Task<Product> CreateProduct(int number, List<ProductImage> images)
    {
        var inputProduct = ProductFactory.BuildNewProduct(
            name: $"Product #{number}",
            price: number,
            description: $"Product #{number} Description",
            images: images
        );
        var outputProduct = await _productRepository.CreateAsync(inputProduct);
        var fullyUpdateProduct = await _productRepository.GetByIdAsync(outputProduct.Id);

        return fullyUpdateProduct!;
    }

    public async Task<Product> CreateProductAndProductHistory(int number, List<ProductImage> images)
    {
        var product = await CreateProduct(number: number, images: images);
        var inputProductHistory = ProductHistoryFactory.BuildNewProductHistory(
            name: product.Name,
            images: product.Images.Select(image => image.FileName).ToList(),
            price: product.Price,
            productId: product.Id,
            description: product.Description
        );
        var productHistory = await _productHistoryRepository.CreateAsync(inputProductHistory);

        return product;
    }

    public async Task<ProductImage> CreateProductImage(TestFileRoute fileRoute, string destinationFileName)
    {
        // Copy file from -> to as destinationFileName
        File.Copy(fileRoute.Value, Path.Join(DirectoryService.GetMediaDirectory(), destinationFileName), overwrite: true);
        
        var menuItemImage = await _productImageRepository.CreateAsync(
            ProductImageFactory.BuildNewProductImage(fileName: destinationFileName)
        );
        
        return menuItemImage;
    }
}