using Domain.Models;
using Domain.ValueObjects.Order;

namespace Domain.DomainFactories;

public class OrderFactory
{
    public static Order BuildExistingOrder(Guid id, decimal total, DateTime dateCreated, DateTime? dateFinished, List<OrderItem> orderItems, OrderStatus status, int serialNumber)
    {
        return new Order(
            id: id,
            total: total,
            dateCreated: dateCreated,
            dateFinished: dateFinished,
            orderItems: orderItems,
            status: status,
            serialNumber: serialNumber
        );
    }

    public static Order BuildNewOrder(Guid id, decimal total, List<OrderItem> orderItems, OrderStatus status)
    {
        return new Order(
            id: id,
            total: total,
            dateCreated: DateTime.UtcNow,
            dateFinished: null,
            orderItems: orderItems,
            status: status,
            serialNumber: 0
        );
    }
}