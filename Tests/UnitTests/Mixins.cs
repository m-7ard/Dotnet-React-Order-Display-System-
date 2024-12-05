
using Domain.Models;
using Domain.ValueObjects.OrderItem;

namespace Tests.UnitTests;

public class Mixins
{
    public static OrderItem CreateOrderItem(Guid orderId, OrderItemStatus status, DateTime dateCreated, DateTime dateFinished)
    {
        return new OrderItem(
            id: Guid.NewGuid(), 
            quantity: 1, 
            status: status, 
            dateCreated: dateCreated, 
            dateFinished: dateFinished, 
            orderId: orderId,
            productHistoryId: Guid.NewGuid(), 
            productId: Guid.NewGuid(),
            serialNumber: 1
        );
    }

    public static ProductHistory CreateProductHistory(int seed)
    {
        return new ProductHistory(
            id: Guid.NewGuid(),
            name: $"Product History {seed}",
            images: [],
            price: seed,
            productId: Guid.NewGuid(),
            validFrom: new DateTime(),
            validTo: new DateTime(),
            description: $"Product History {seed} description"
        );
    }

    public static Product CreateProduct(int seed, List<ProductImage> images)
    {
        return new Product(
            id: Guid.NewGuid(),
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
            fileName: $"filename {seed}",
            originalFileName: $"original filename {seed}",
            url: $"url ${seed}",
            dateCreated: new DateTime(),
            productId: Guid.NewGuid()
        );
    }
}