using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.Product;

namespace Domain.DomainFactories;

public class OrderFactory
{
    public static Order BuildExistingOrder(OrderId id, decimal total, OrderDates orderDates, List<OrderItem> orderItems, OrderStatus status, int serialNumber)
    {
        return new Order(
            id: id,
            total: total,
            orderDates: orderDates,
            orderItems: orderItems,
            status: status,
            serialNumber: serialNumber
        );
    }

    public static Order BuildNewOrder(OrderId id, decimal total, List<OrderItem> orderItems, OrderStatus status, int serialNumber)
    {
        var orderDates = OrderDates.ExecuteCreate(dateCreated: DateTime.UtcNow, dateFinished: null);

        return new Order(
            id: id,
            total: total,
            orderDates: orderDates,
            orderItems: orderItems,
            status: status,
            serialNumber: serialNumber
        );
    }
}