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

        var canCreateOrderDates = OrderDates.CanCreate(dateCreated: order.OrderDates.DateCreated, dateFinished: DateTime.Now);
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

    public static void ExecuteMarkFinished(Order order)
    {
        var canMarkFinished = CanMarkFinished(order);
        if (canMarkFinished.TryPickT1(out var error, out var _))
        {
            throw new Exception(error);
        }

        order.ExecuteTransitionStatus(OrderStatus.Finished.Name);
        var orderDates = OrderDates.ExecuteCreate(dateCreated: order.OrderDates.DateCreated, dateFinished: DateTime.Now);
        order.OrderDates = orderDates;
    }

    public static OneOf<OrderItem, string> CanMarkOrderItemFinished(Order order, Guid orderItemId)
    {
        var orderItem = order.GetOrderItemById(orderItemId);
        if (orderItem is null)
        {
            return $"Order Item of Id \"{orderItemId}\" does not exist on Order of Id \"{order.Id}\"";
        }

        var canTransitionStatusResult = orderItem.CanTransitionStatus(OrderStatus.Finished.Name);
        if (canTransitionStatusResult.TryPickT1(out var error, out var _))
        {
            return error;
        }

        var canCreateOrderDates = OrderDates.CanCreate(dateCreated: orderItem.OrderItemDates.DateCreated, dateFinished: DateTime.Now);
        if (canCreateOrderDates.TryPickT1(out error, out _))
        {
            return error;
        }

        return orderItem;
    }

    public static void ExecuteMarkOrderItemFinished(Order order, Guid orderItemId)
    {
        var canMarkOrderItemFinished = CanMarkOrderItemFinished(order, orderItemId);
        if (canMarkOrderItemFinished.TryPickT1(out var error, out var orderItem))
        {
            throw new Exception(error);
        }

        orderItem.ExecuteTransitionStatus(OrderStatus.Finished.Name);
        var orderItemDates = OrderItemDates.ExecuteCreate(dateCreated: orderItem.OrderItemDates.DateCreated, dateFinished: DateTime.Now);
        orderItem.OrderItemDates = orderItemDates;
        order.DomainEvents.Add(new OrderItemPendingUpdatingEvent(orderItem));
    }
}