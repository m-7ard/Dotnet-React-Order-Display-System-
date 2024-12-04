
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
            productHistoryId: 1, 
            productId: 1
        );
    }

}