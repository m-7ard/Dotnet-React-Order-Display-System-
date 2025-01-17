using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;

namespace Domain.DomainFactories;

public class OrderItemFactory
{
    public static OrderItem BuildExistingOrderItem(OrderItemId id, int quantity, OrderItemStatus status, OrderItemDates orderItemDates, OrderId orderId, ProductHistoryId productHistoryId, ProductId productId, int serialNumber)
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

    public static OrderItem BuildNewOrderItem(OrderItemId id, OrderId orderId, int quantity, OrderItemStatus status, ProductHistoryId productHistoryId, ProductId productId, int serialNumber)
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