using Application.Common;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;
using Domain.ValueObjects.ProductImage;
using Domain.ValueObjects.Shared;
using Infrastructure;
using Infrastructure.Interfaces;
using Infrastructure.Persistence;
using Infrastructure.Querying;
using Microsoft.Extensions.Logging.Abstractions;

namespace Tests.IntegrationTests;

public class Mixins
{
    private readonly SimpleProductOrderServiceDbContext _dbContexts;
    private readonly IProductRepository _productRepository;
    private readonly IDraftImageRepository _draftImageRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IOrderRepository _orderRespository;
    private readonly ISequenceService _sequenceService;

    public Mixins(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext, IDatabaseProviderSingleton databaseProviderSingleton)
    {
        _dbContexts = simpleProductOrderServiceDbContext;
        _productRepository = new ProductRepository(_dbContexts, new ProductDbEntityQueryServiceFactory(databaseProviderSingleton));
        _draftImageRepository = new DraftImageRepository(_dbContexts);
        _productHistoryRepository = new ProductHistoryRespository(_dbContexts, new ProductHistoryDbEntityQueryServiceFactory(databaseProviderSingleton));
        _orderRespository = new OrderRepository(_dbContexts, new OrderDbEntityQueryServiceFactory(databaseProviderSingleton));
        _sequenceService = new SequenceService(_dbContexts, NullLogger<SequenceService>.Instance);
    }

    public async Task<Product> CreateProduct(int number, List<DraftImage> images)
    {
        var productId = Guid.NewGuid();
        var product = ProductFactory.BuildNewProduct(
            id: ProductId.ExecuteCreate(productId),
            name: $"Product #{number}",
            price: Money.ExecuteCreate(number),
            description: $"Product #{number} Description",
            images: images.Select((image) => ProductImageFactory.BuildNewProductImageFromDraftImage(
                source: image,
                id: ProductImageId.ExecuteCreate(Guid.NewGuid()),
                productId: ProductId.ExecuteCreate(productId)
            )).ToList()
        );

        await _productRepository.CreateAsync(product);
        var upToDateProduct = await _productRepository.GetByIdAsync(product.Id);

        foreach (var draftImage in images)
        {
            await _draftImageRepository.DeleteByFileNameAsync(draftImage.FileName);
        }

        return upToDateProduct!;
    }

    public async Task<Product> CreateProductAndProductHistory(int number, List<DraftImage> images)
    {
        var product = await CreateProduct(number: number, images: images);
        var inputProductHistory = ProductHistoryFactory.BuildNewProductHistory(
            id: ProductHistoryId.ExecuteCreate(Guid.NewGuid()),
            name: product.Name,
            images: product.Images.Select(image => image.FileName.Value).ToList(),
            price: product.Price,
            productId: product.Id,
            description: product.Description
        );
        var productHistory = await _productHistoryRepository.CreateAsync(inputProductHistory);

        return product;
    }

    public async Task<DraftImage> CreateDraftImage(TestFileRoute fileRoute, string destinationFileName)
    {
        // Copy a file from [fileRoute] that is an existing file's path
        // To a destination, where it includes the fileName in the path at the end
        File.Copy(fileRoute.Value, Path.Join(DirectoryService.GetMediaDirectory(), destinationFileName), overwrite: true);
        
        var menuItemImage = await _draftImageRepository.CreateAsync(
            DraftImageFactory.BuildNewDraftImage(
                fileName: FileName.ExecuteCreate(destinationFileName), 
                originalFileName: FileName.ExecuteCreate("originalFileName.png"), 
                url: $"Media/{destinationFileName}"
            )
        );
        
        return menuItemImage;
    }

    public async Task<Order> CreateOrder(List<Product> products, int seed, OrderStatus orderStatus) {
        var newOrder = OrderFactory.BuildNewOrder(
            id: OrderId.ExecuteCreate(Guid.NewGuid()),
            status: orderStatus,
            serialNumber: await _sequenceService.GetNextOrderValueAsync()
        );

        foreach (var product in products)
        {
            var productHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);
            if (productHistory is null)
            {
                throw new Exception("A Product's ProductHistory cannot be null when creating an Order because an Order's OrderItems need a non-null ProductHistoryId.");
            }
            
            newOrder.ExecuteAddOrderItem(id: Guid.NewGuid(), product: product, productHistory: productHistory, quantity: seed, serialNumber: await _sequenceService.GetNextOrderItemValueAsync());
        }

        await _orderRespository.CreateAsync(newOrder);
        var insertedOrder = await _orderRespository.GetByIdAsync(newOrder.Id);
        if (insertedOrder is null)
        {
            throw new Exception("Order was not inserted.");
        }

        return insertedOrder;
    }
}