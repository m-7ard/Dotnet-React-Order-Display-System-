using Domain.Models;
using Domain.ValueObjects.Order;

namespace Domain.DomainFactories;

public class OrderFactory
{
    public static Order BuildExistingOrder(int id, decimal total, DateTime dateCreated, DateTime dateFinished, List<OrderItem> orderItems, OrderStatus status)
    {
        return new Order(
            id: id,
            total: total,
            dateCreated: dateCreated,
            dateFinished: dateFinished,
            orderItems: orderItems,
            status: status
        );
    }

    public static Order BuildNewOrder(decimal total, List<OrderItem> orderItems, OrderStatus status)
    {
        return new Order(
            id: 0,
            total: total,
            dateCreated: new DateTime(),
            dateFinished: new DateTime(),
            orderItems: orderItems,
            status: status
        );
    }
}