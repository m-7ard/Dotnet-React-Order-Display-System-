using Domain.Models;
using Domain.ValueObjects.OrderItem;

namespace Domain.DomainFactories;

public class OrderItemFactory
{
    public static OrderItem BuildExistingOrderItem(int id, int quantity, OrderItemStatus status, DateTime dateCreated, DateTime dateFinished, int orderId, int productHistoryId, int productId)
    {
        return new OrderItem(
            id: id,
            quantity: quantity,
            status: status,
            dateCreated: dateCreated,
            dateFinished: dateFinished,
            orderId: orderId,
            productHistoryId: productHistoryId,
            productId: productId
        );
    }

    public static OrderItem BuildNewOrderItem(int quantity, OrderItemStatus status, int productHistoryId, int productId)
    {
        return new OrderItem(
            id: 0,
            quantity: quantity,
            status: status,
            dateCreated: new DateTime(),
            dateFinished: new DateTime(),
            orderId: 0,
            productHistoryId: productHistoryId,
            productId: productId
        );
    }
}