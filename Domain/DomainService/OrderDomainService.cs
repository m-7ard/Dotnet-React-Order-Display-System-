using Domain.Contracts.Orders;
using Domain.DomainEvents.Order;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using OneOf;

namespace Domain.DomainService;

public static class OrderDomainService
{
    public static OneOf<bool, string> CanCreateNewOrder(Guid id, int serialNumber)
    {
        var contract = new CreateOrderContract(
            id: id,
            serialNumber: serialNumber,
            total: 0,
            status: OrderItemStatus.Pending.Name,
            dateCreated: DateTime.UtcNow,
            dateFinished: null,
            orderItems: []
        );

        return Order.CanCreate(contract);
    }

    public static Order ExecuteCreateNewOrder(Guid id, int serialNumber)
    {
        var contract = new CreateOrderContract(
            id: id,
            serialNumber: serialNumber,
            total: 0,
            status: OrderItemStatus.Pending.Name,
            dateCreated: DateTime.UtcNow,
            dateFinished: null,
            orderItems: []
        );

        return Order.ExecuteCreate(contract);
    }

    public static OneOf<bool, string> CanMarkFinished(Order order)
    {
        var contract = new TransitionStatusContract(status: OrderStatus.Finished.Name, dateCreated: order.OrderSchedule.Dates.DateCreated, dateFinished: DateTime.UtcNow);
        var canTransitionStatusResult = order.CanTransitionStatus(contract);
        if (canTransitionStatusResult.IsT1) return canTransitionStatusResult.AsT1;

        var allOrderItemAreFinished = order.OrderItems.All(orderItem => orderItem.Status == OrderItemStatus.Finished);
        if (!allOrderItemAreFinished) return "All order items must be finished in order to mark the order as finished.";

        return true;
    }

    public static DateTime ExecuteMarkFinished(Order order)
    {
        var canMarkFinished = CanMarkFinished(order);
        if (canMarkFinished.IsT1) throw new Exception(canMarkFinished.AsT1);

        var dateFinished = DateTime.UtcNow;
        var contract = new TransitionStatusContract(status: OrderStatus.Finished.Name, dateCreated: order.OrderSchedule.Dates.DateCreated, dateFinished: dateFinished);
        order.ExecuteTransitionStatus(contract);
        
        return dateFinished;
    }

    public static OneOf<OrderItem, string> CanMarkOrderItemFinished(Order order, OrderItemId orderItemId)
    {
        var canGetOrderItemResult = order.TryGetOrderItemById(orderItemId);
        if (canGetOrderItemResult.TryPickT1(out var error, out var orderItem))
        {
            return error;
        }

        var canTransitionStatusResult = orderItem.CanTransitionStatus(OrderStatus.Finished.Name);
        if (canTransitionStatusResult.TryPickT1(out error, out var _))
        {
            return error;
        }

        var canCreateOrderDates = OrderDates.CanCreate(dateCreated: orderItem.OrderItemDates.DateCreated, dateFinished: DateTime.UtcNow);
        if (canCreateOrderDates.TryPickT1(out error, out _))
        {
            return error;
        }

        return orderItem;
    }

    public static DateTime ExecuteMarkOrderItemFinished(Order order, OrderItemId orderItemId)
    {
        var canMarkOrderItemFinished = CanMarkOrderItemFinished(order, orderItemId);
        if (canMarkOrderItemFinished.TryPickT1(out var error, out var orderItem))
        {
            throw new Exception(error);
        }

        orderItem.ExecuteTransitionStatus(OrderStatus.Finished.Name);

        var dateFinished = DateTime.UtcNow;
        var orderItemDates = OrderItemDates.ExecuteCreate(dateCreated: orderItem.OrderItemDates.DateCreated, dateFinished: dateFinished);
        orderItem.OrderItemDates = orderItemDates;

        order.DomainEvents.Add(new OrderItemUpdated(orderItem));
        return dateFinished;
    }
}