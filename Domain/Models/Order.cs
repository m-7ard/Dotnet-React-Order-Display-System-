using Domain.DomainEvents;
using Domain.DomainEvents.Order;
using Domain.DomainFactories;
using Domain.Errors;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using OneOf;

namespace Domain.Models;
public class Order
{
    public Order(Guid id, decimal total, DateTime dateCreated, DateTime dateFinished, List<OrderItem> orderItems, OrderStatus status)
    {
        Id = id;
        Total = total;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        OrderItems = orderItems;
        Status = status;
    }

    public Guid Id { get; private set; }
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime DateFinished { get; set; }
    public List<OrderItem> OrderItems { get; set; }
    public List<DomainEvent> DomainEvents { get; set; } = [];

    private void UpdateStatus(OrderStatus status)
    {
        Status = status;

        if (status == OrderStatus.Finished)
        {
            DateFinished = DateTime.Now;
        }
    }

    private void UpdateOrderItemStatus(Guid orderItemId, OrderItemStatus status)
    {
        var orderItem = OrderItems.Find(orderItem => orderItem.Id == orderItemId);
        if (orderItem is null)
        {
            throw new Exception($"OrderItem of Id \"{orderItemId}\" does not exist on Order of Id \"{Id}\"");
        }

        orderItem.UpdateStatus(status);
        DomainEvents.Add(new OrderItemPendingUpdatingEvent(orderItem));
    }

    public OneOf<bool, List<DomainError>> TryMarkFinished()
    {
        if (OrderItems.Any(d => d.Status != OrderItemStatus.Finished))
        {
            return DomainErrorFactory.CreateSingleListError(
                message: $"All OrderItems must be finished in order to mark it as finished.",
                path: ["_"],
                code: "ORDER_ITEMS_NOT_FINISHED"
            );
        }

        if (Status == OrderStatus.Finished)
        {
            return DomainErrorFactory.CreateSingleListError(
                message: $"Order is already finished.",
                path: ["_"],
                code: "ORDER_ALREADY_FINISHED"
            );
        }

        UpdateStatus(OrderStatus.Finished);
        return true;
    }

    public OneOf<bool, List<DomainError>> TryMarkOrderItemFinished(Guid orderItemId)
    {
        var orderItem = OrderItems.Find(orderItem => orderItem.Id == orderItemId);
        if (orderItem is null)
        {
            return DomainErrorFactory.CreateSingleListError(
                message: $"OrderItem with Id \"{orderItemId}\" does not exist does not exist in Order of id \"${Id}\".",
                path: ["_"],
                code: "ORDER_ITEM_DOES_NOT_EXIST"
            );
        }

        if (orderItem.Status == OrderItemStatus.Finished)
        {
            return DomainErrorFactory.CreateSingleListError(
                message: $"OrderItem with Id \"{orderItemId}\" is already finished.",
                path: ["_"],
                code: "ORDER_ITEM_ALREADY_FINISHED"
            );
        }

        UpdateOrderItemStatus(orderItemId, OrderItemStatus.Finished);
        return true;
    }

    public OneOf<OrderItem, List<DomainError>> TryAddOrderItem(ProductHistory productHistory, int quantity)
    {
        // Todo: add some rule of whether duplicates are allowed
        var orderItem = OrderItemFactory.BuildNewOrderItem(
            id: Guid.NewGuid(),
            orderId: Id,
            quantity: quantity,
            status: OrderItemStatus.Pending,
            productHistoryId: productHistory.Id,
            productId: productHistory.ProductId
        );

        Total += productHistory.Price * quantity;
        OrderItems.Add(orderItem);

        return orderItem;
    }
}