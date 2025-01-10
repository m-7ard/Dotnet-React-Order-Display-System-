using Domain.Models;
using Domain.ValueObjects.OrderItem;

namespace Domain.DomainFactories;

public class OrderItemFactory
{
    public static OrderItem BuildExistingOrderItem(Guid id, int quantity, OrderItemStatus status, OrderItemDates orderItemDates, Guid orderId, Guid productHistoryId, Guid productId, int serialNumber)
    {
        return new OrderItem(
            id: id,
            quantity: quantity,
            status: status,
            orderItemDates: orderItemDates,
            orderId: orderId,
            productHistoryId: productHistoryId,
            productId: productId,
            serialNumber: serialNumber
        );
    }

    public static OrderItem BuildNewOrderItem(Guid id, Guid orderId, int quantity, OrderItemStatus status, Guid productHistoryId, Guid productId, int serialNumber)
    {
        var orderDates = OrderItemDates.ExecuteCreate(dateCreated: DateTime.UtcNow, dateFinished: null);

        return new OrderItem(
            id: id,
            quantity: quantity,
            status: status,
            orderItemDates: orderDates,
            orderId: orderId,
            productHistoryId: productHistoryId,
            productId: productId,
            serialNumber: serialNumber
        );
    }
}