using Domain.Models;
using Domain.ValueObjects.OrderItem;

namespace Domain.DomainFactories;

public class OrderItemFactory
{
    public static OrderItem BuildExistingOrderItem(int id, int quantity, OrderItemStatus status, DateTime dateCreated, DateTime dateFinished, int orderId, ProductHistory productHistory)
    {
        return new OrderItem(
            id: id,
            quantity: quantity,
            status: status,
            dateCreated: dateCreated,
            dateFinished: dateFinished,
            orderId: orderId,
            productHistory: productHistory
        );
    }

    public static OrderItem BuildNewOrderItem(int quantity, OrderItemStatus status, int orderId, ProductHistory productHistory)
    {
        return new OrderItem(
            id: 0,
            quantity: quantity,
            status: status,
            dateCreated: new DateTime(),
            dateFinished: new DateTime(),
            orderId: orderId,
            productHistory: productHistory
        );
    }
}