using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Product;

namespace Domain.DomainFactories;

public class OrderItemFactory
{
    public static OrderItem BuildExistingOrderItem(Guid id, int quantity, OrderItemStatus status, OrderItemDates orderItemDates, OrderId orderId, Guid productHistoryId, ProductId productId, int serialNumber)
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

    public static OrderItem BuildNewOrderItem(Guid id, OrderId orderId, int quantity, OrderItemStatus status, Guid productHistoryId, ProductId productId, int serialNumber)
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