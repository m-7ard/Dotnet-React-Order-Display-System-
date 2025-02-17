using Domain.DomainEvents.Order;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using OneOf;

namespace Domain.DomainService;

public class OrderDomainService
{
    public static OneOf<bool, string> CanMarkFinished(Order order)
    {
        var canTransitionStatusResult = order.CanTransitionStatus(OrderStatus.Finished.Name);
        if (canTransitionStatusResult.TryPickT1(out var error, out var _))
        {
            return error;
        }

        var canCreateOrderDates = OrderDates.CanCreate(dateCreated: order.OrderDates.DateCreated, dateFinished: DateTime.UtcNow);
        if (canCreateOrderDates.TryPickT1(out error, out _))
        {
            return error;
        }

        var allOrderItemAreFinished = order.OrderItems.All(orderItem => orderItem.Status == OrderItemStatus.Finished);
        if (!allOrderItemAreFinished)
        {
            return "All order items must be finished in order to mark the order as finished.";
        }

        return true;
    }

    public static DateTime ExecuteMarkFinished(Order order)
    {
        var canMarkFinished = CanMarkFinished(order);
        if (canMarkFinished.TryPickT1(out var error, out var _))
        {
            throw new Exception(error);
        }

        order.ExecuteTransitionStatus(OrderStatus.Finished.Name);
        
        var dateFinished = DateTime.UtcNow;
        var orderDates = OrderDates.ExecuteCreate(dateCreated: order.OrderDates.DateCreated, dateFinished: dateFinished);
        order.OrderDates = orderDates;

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