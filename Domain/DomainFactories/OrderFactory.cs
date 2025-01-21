using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.Shared;

namespace Domain.DomainFactories;

public class OrderFactory
{
    public static Order BuildExistingOrder(OrderId id, Money total, OrderDates orderDates, List<OrderItem> orderItems, OrderStatus status, int serialNumber)
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

    public static Order BuildNewOrder(OrderId id, OrderStatus status, int serialNumber)
    {
        var orderDates = OrderDates.ExecuteCreate(dateCreated: DateTime.UtcNow, dateFinished: null);

        return new Order(
            id: id,
            total: Money.ZeroTotal,
            orderDates: orderDates,
            orderItems: [],
            status: status,
            serialNumber: serialNumber
        );
    }
}