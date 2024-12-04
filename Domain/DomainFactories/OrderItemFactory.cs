using Domain.Models;
using Domain.ValueObjects.OrderItem;

namespace Domain.DomainFactories;

public class OrderItemFactory
{
    public static OrderItem BuildExistingOrderItem(Guid id, int quantity, OrderItemStatus status, DateTime dateCreated, DateTime dateFinished, Guid orderId, int productHistoryId, int productId, int serialNumber)
    {
        return new OrderItem(
            id: id,
            quantity: quantity,
            status: status,
            dateCreated: dateCreated,
            dateFinished: dateFinished,
            orderId: orderId,
            productHistoryId: productHistoryId,
            productId: productId,
            serialNumber: serialNumber
        );
    }

    public static OrderItem BuildNewOrderItem(Guid id, Guid orderId, int quantity, OrderItemStatus status, int productHistoryId, int productId)
    {
        return new OrderItem(
            id: id,
            quantity: quantity,
            status: status,
            dateCreated: DateTime.UtcNow,
            dateFinished: new DateTime(),
            orderId: orderId,
            productHistoryId: productHistoryId,
            productId: productId,
            serialNumber: 0
        );
    }
}