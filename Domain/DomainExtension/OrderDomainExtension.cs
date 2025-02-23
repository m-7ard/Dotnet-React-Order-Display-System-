using Domain.Contracts.OrderItems;
using Domain.Contracts.Orders;
using Domain.DomainEvents.Order;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using OneOf;

namespace Domain.DomainExtension;

public static class OrderDomainExtension
{
    public static OneOf<CreateOrderContract, string> CanCreateNewOrder(Guid id, int serialNumber)
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

        var canCreate = Order.CanCreate(contract);
        if (canCreate.IsT1) return canCreate.AsT1;

        return contract;
    }

    public static Order ExecuteCreateNewOrder(Guid id, int serialNumber)
    {
        var canCreate = CanCreateNewOrder(id: id, serialNumber: serialNumber);
        if (canCreate.IsT1) throw new Exception(canCreate.AsT1);

        var contract = canCreate.AsT0;
        var order = Order.ExecuteCreate(contract);

        return order;
    }

    public static OneOf<AddOrderItemContract, string> CanAddNewOrderItem(AddNewOrderItemContract contract)
    {
        var addOrderItemContract = new AddOrderItemContract(
            id: contract.Id,
            productId: contract.ProductId,
            productHistoryId: contract.ProductHistoryId,
            status: OrderItemStatus.Pending.Name,
            serialNumber: contract.SerialNumber,
            dateCreated: DateTime.UtcNow,
            dateFinished: null,
            total: contract.Total,
            quantity: contract.Quantity
        );

        var order = contract.Order;
        var canAdd = order.CanAddOrderItem(addOrderItemContract);
        if (canAdd.IsT1) return canAdd.AsT1;

        return addOrderItemContract;
    }

    public static OrderItemId ExecuteAddNewOrderItem(AddNewOrderItemContract contract)
    {
        var canAdd = CanAddNewOrderItem(contract);
        if (canAdd.IsT1) throw new Exception(canAdd.AsT1);

        var order = contract.Order;
        var orderItemId = order.ExecuteAddOrderItem(canAdd.AsT0);

        return orderItemId;
    }

    public static OneOf<bool, string> CanMarkFinished(Order order)
    {
        var contract = new TransitionOrderStatusContract(status: OrderStatus.Finished.Name, dateCreated: order.OrderSchedule.Dates.DateCreated, dateFinished: DateTime.UtcNow);
        var canTransitionStatusResult = order.CanTransitionStatus(contract);
        if (canTransitionStatusResult.IsT1) return canTransitionStatusResult.AsT1;

        var allOrderItemAreFinished = order.OrderItems.All(orderItem => orderItem.Schedule.Status == OrderItemStatus.Finished);
        if (!allOrderItemAreFinished) return "All order items must be finished in order to mark the order as finished.";

        return true;
    }

    public static DateTime ExecuteMarkFinished(Order order)
    {
        var canMarkFinished = CanMarkFinished(order);
        if (canMarkFinished.IsT1) throw new Exception(canMarkFinished.AsT1);

        var dateFinished = DateTime.UtcNow;
        var contract = new TransitionOrderStatusContract(status: OrderStatus.Finished.Name, dateCreated: order.OrderSchedule.Dates.DateCreated, dateFinished: dateFinished);
        order.ExecuteTransitionStatus(contract);
        
        return dateFinished;
    }

    public static OneOf<OrderItem, string> CanMarkOrderItemFinished(Order order, OrderItemId orderItemId)
    {
        var canGetOrderItemResult = order.TryGetOrderItemById(orderItemId);
        if (canGetOrderItemResult.IsT1) return canGetOrderItemResult.AsT1;

        var orderItem = canGetOrderItemResult.AsT0;

        var contract = new TransitionOrderItemStatusContract(status: OrderItemStatus.Finished.Name, dateCreated: orderItem.Schedule.Dates.DateCreated, dateFinished: DateTime.UtcNow);
        var canTransitionStatusResult = orderItem.CanTransitionStatus(contract);
        if (canTransitionStatusResult.IsT1) return canTransitionStatusResult.AsT1;

        return orderItem;
    }

    public static DateTime ExecuteMarkOrderItemFinished(Order order, OrderItemId orderItemId)
    {
        var canMarkOrderItemFinished = CanMarkOrderItemFinished(order, orderItemId);
        if (canMarkOrderItemFinished.TryPickT1(out var error, out var orderItem))
        {
            throw new Exception(error);
        }

        var dateFinished = DateTime.UtcNow;
        var contract = new TransitionOrderItemStatusContract(status: OrderItemStatus.Finished.Name, dateCreated: orderItem.Schedule.Dates.DateCreated, dateFinished: dateFinished);
        orderItem.ExecuteTransitionStatus(contract);

        order.DomainEvents.Add(new OrderItemUpdated(orderItem));
        return dateFinished;
    }
}