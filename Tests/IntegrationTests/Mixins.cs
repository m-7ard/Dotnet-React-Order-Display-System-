using Application.Common;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Infrastructure;
using Infrastructure.Persistence;

namespace Tests.IntegrationTests;

public class Mixins
{
    private readonly SimpleProductOrderServiceDbContext _dbContexts;
    private readonly IProductRepository _productRepository;
    private readonly IDraftImageRepository _draftImageRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IOrderRepository _orderRespository;

    public Mixins(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _dbContexts = simpleProductOrderServiceDbContext;
        _productRepository = new ProductRepository(_dbContexts);
        _draftImageRepository = new DraftImageRepository(_dbContexts);
        _productHistoryRepository = new ProductHistoryRespository(_dbContexts);
        _orderRespository = new OrderRepository(_dbContexts);
    }

    public async Task<Product> CreateProduct(int number, List<DraftImage> images)
    {
        var inputProduct = ProductFactory.BuildNewProduct(
            name: $"Product #{number}",
            price: number,
            description: $"Product #{number} Description",
            images: images.Select(ProductImageFactory.BuildNewProductImageFromDraftImage).ToList()
        );

        var outputProduct = await _productRepository.CreateAsync(inputProduct);
        foreach (var draftImage in images)
        {
            await _draftImageRepository.DeleteByFileNameAsync(draftImage.FileName);
        }

        return outputProduct!;
    }

    public async Task<Product> CreateProductAndProductHistory(int number, List<DraftImage> images)
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

    public async Task<DraftImage> CreateDraftImage(TestFileRoute fileRoute, string destinationFileName)
    {
        // Copy file from -> to as destinationFileName
        File.Copy(fileRoute.Value, Path.Join(DirectoryService.GetMediaDirectory(), destinationFileName), overwrite: true);
        
        var menuItemImage = await _draftImageRepository.CreateAsync(
            DraftImageFactory.BuildNewDraftImage(
                fileName: destinationFileName, 
                originalFileName: "originalFileName.png", 
                url: $"Media/{destinationFileName}"
            )
        );
        
        return menuItemImage;
    }

    public async Task<Order> CreateOrder(List<Product> products, int seed, OrderStatus orderStatus) {
        var newOrder = OrderFactory.BuildNewOrder(
            id: Guid.NewGuid(),
            total: 0,
            orderItems: [],
            status: orderStatus
        );

        foreach (var product in products)
        {
            var productHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);
            if (productHistory is null)
            {
                throw new Exception("A Product's ProductHistory cannot be null when creating an Order because an Order's OrderItems need a non-null ProductHistoryId.");
            }
            
            var result = newOrder.TryAddOrderItem(productHistory, seed);
            if (result.TryPickT1(out var errors, out var orderItem))
            {
                throw new Exception("Something went wrong in Mixins.CreateOrder trying to add an OrderItem to an Order");
            }
        }

        await _orderRespository.CreateAsync(newOrder);
        return newOrder;
    }
}