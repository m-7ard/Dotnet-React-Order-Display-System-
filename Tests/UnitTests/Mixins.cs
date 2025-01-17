
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;

namespace Tests.UnitTests;

public class Mixins
{
    public static OrderItem CreateOrderItem(OrderId orderId, OrderItemStatus status, DateTime dateCreated, DateTime? dateFinished)
    {
        return new OrderItem(
            id: OrderItemId.ExecuteCreate(Guid.NewGuid()), 
            quantity: 1, 
            status: status, 
            orderItemDates: OrderItemDates.ExecuteCreate(
                dateCreated: dateCreated, 
                dateFinished: dateFinished
            ),
            orderId: orderId,
            productHistoryId: ProductHistoryId.ExecuteCreate(Guid.NewGuid()), 
            productId: ProductId.ExecuteCreate(Guid.NewGuid()),
            serialNumber: 1
        );
    }

    public static ProductHistory CreateProductHistory(int seed)
    {
        return new ProductHistory(
            id: ProductHistoryId.ExecuteCreate(Guid.NewGuid()),
            name: $"Product History {seed}",
            images: [],
            price: seed,
            productId: ProductId.ExecuteCreate(Guid.NewGuid()),
            validFrom: new DateTime(),
            validTo: new DateTime(),
            description: $"Product History {seed} description"
        );
    }

    public static Product CreateProduct(int seed, List<ProductImage> images)
    {
        return new Product(
            id: ProductId.ExecuteCreate(Guid.NewGuid()),
            dateCreated: new DateTime(),
            name: $"Product #{seed}",
            price: seed,
            description: $"Product #{seed} description",
            images: images
        );
    }

    public static ProductImage CreateProductImage(int seed)
    {
        return new ProductImage(
            id: Guid.NewGuid(),
            fileName: $"filename_{seed}.png",
            originalFileName: $"original filename_{seed}.png",
            url: $"url_{seed}.png",
            dateCreated: new DateTime(),
            productId: Guid.NewGuid()
        );
    }
}