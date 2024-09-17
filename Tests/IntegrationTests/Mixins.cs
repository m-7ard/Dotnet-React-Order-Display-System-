using Application.Common;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Infrastructure;
using Infrastructure.Persistence;

namespace Tests.IntegrationTests;

public class Mixins
{
    private readonly SimpleProductOrderServiceDbContext _simpleProductOrderServiceDbContexts;
    private readonly IProductRepository _productRepository;
    private readonly IProductImageRepository _productImageRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IOrderRepository _orderRespository;
    private readonly IOrderItemRepository _orderItemRespository;

    public Mixins(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _simpleProductOrderServiceDbContexts = simpleProductOrderServiceDbContext;
        _productRepository = new ProductRepository(_simpleProductOrderServiceDbContexts);
        _productImageRepository = new ProductImageRepository(_simpleProductOrderServiceDbContexts);
        _productHistoryRepository = new ProductHistoryRespository(_simpleProductOrderServiceDbContexts);
        _orderRespository = new OrderRepository(_simpleProductOrderServiceDbContexts);
        _orderItemRespository = new OrderItemRepository(_simpleProductOrderServiceDbContexts);
    }

    public async Task<Product> CreateProduct(int number, List<ProductImage> images)
    {
        var inputProduct = ProductFactory.BuildNewProduct(
            name: $"Product #{number}",
            price: number,
            description: $"Product #{number} Description",
            images: []
        );
        var outputProduct = await _productRepository.CreateAsync(inputProduct);
        foreach (var image in images)
        {
            outputProduct.Images.Add(await _productImageRepository.AssignToProductAsync(productId: outputProduct.Id, productImageId: image.Id));
        }

        return outputProduct!;
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

    public async Task<Order> CreateOrder(List<Product> products, int number, OrderStatus orderStatus, OrderItemStatus orderItemStatus) {
        var productItemHistories = new List<ProductHistory>();
        foreach (var product in products)
        {
            var productHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);
            if (productHistory is null)
            {
                throw new Exception("A Product's ProductHistory cannot be null when creating an Order because an Order's OrderItems need to point at it.");
            }
            
            productItemHistories.Add(productHistory);
        }

        var order = await _orderRespository.CreateAsync(OrderFactory.BuildNewOrder(
            total: products.Sum(d => d.Price * number),
            orderItems: [],
            status: orderStatus
        ));

        foreach (var productHistory in productItemHistories)
        {
            var orderItem = await _orderItemRespository.CreateAsync(OrderItemFactory.BuildNewOrderItem(
                quantity: number,
                status: orderItemStatus,
                orderId: order.Id,
                productHistory: productHistory
            ));
            
            order.OrderItems.Add(orderItem);
        }

        return order;
    }
}