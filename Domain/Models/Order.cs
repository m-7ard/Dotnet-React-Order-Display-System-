using Domain.DomainEvents;
using Domain.DomainFactories;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Shared;
using OneOf;

namespace Domain.Models;

public class Order
{
    public Order(OrderId id, Money total, List<OrderItem> orderItems, OrderStatus status, int serialNumber, OrderDates orderDates)
    {
        Id = id;
        Total = total;
        OrderItems = orderItems;
        Status = status;
        SerialNumber = serialNumber;
        OrderDates = orderDates;
    }

    public OrderId Id { get; private set; }
    public int SerialNumber { get; private set; }
    public Money Total { get; set; }
    public OrderStatus Status { get; set; }
    public OrderDates OrderDates { get; set; }
    public List<OrderItem> OrderItems { get; set; }

    public List<DomainEvent> DomainEvents { get; set; } = [];
    public void ClearEvents()
    {
        DomainEvents = [];
    }

    private Dictionary<string, List<OrderStatus>> ValidStatusStatusTransitions = new Dictionary<string, List<OrderStatus>>()
    {
        { OrderStatus.Pending.Name, [OrderStatus.Finished] },
        { OrderStatus.Finished.Name, [] },
    };
    
    public OneOf<OrderStatus, string> CanTransitionStatus(string value)
    {
        var statusCreationResult = OrderStatus.CanCreate(value);
        if (statusCreationResult.TryPickT1(out var errors, out var _))
        {
            return errors;
        }

        if (!ValidStatusStatusTransitions.TryGetValue(Status.Name, out var transitionList))
        {
            return $"Invalid status transition from {Status.Name} to {value}.";
        }

        var newStatusObject = transitionList.Find(status => status.Name == value); 
        if (newStatusObject is null)
        {
            return $"Invalid status transition from {Status.Name} to {value}.";
        }

        return newStatusObject;
    }

    public void ExecuteTransitionStatus(string value)
    {
        var canTransitionStatus = CanTransitionStatus(value);
        if (canTransitionStatus.TryPickT1(out var error, out var newStatus))
        {
            throw new Exception(error);
        }

        Status = newStatus;
    }

    public OneOf<bool, string> CanAddOrderItem(Guid id, Product product, ProductHistory productHistory, int quantity)
    {
        var canCreateOrderItemId = OrderItemId.CanCreate(id);
        if (canCreateOrderItemId.TryPickT1(out var error, out _))
        {
            return error;
        }

        var canCreateQuantity = Quantity.CanCreate(quantity);
        if (canCreateQuantity.TryPickT1(out error, out _))
        {
            return error;
        }

        var canCreateTotal = Money.CanCreate(productHistory.Price.Value * quantity);
        if (canCreateOrderItemId.TryPickT1(out error, out _))
        {
            return error;
        }


        if (product.Id != productHistory.ProductId)
        {
            return "Product History's Product Id does not match Product Id.";
        }

        if (!productHistory.IsValid())
        {
            return $"Product History for Product of Id \"{product.Id}\" is not valid.";
        }

        var existingOrderItem = OrderItems.Find(orderItem => orderItem.ProductId == product.Id);
        if (existingOrderItem is not null)
        {
            return "Product has already been added as an Order Item.";
        }

        return true;
    }

    public OrderItemId ExecuteAddOrderItem(Guid id, Product product, ProductHistory productHistory, int quantity, int serialNumber) 
    {
        var canAddOrderItemResult = CanAddOrderItem(id: id, product: product, productHistory: productHistory, quantity: quantity);
        if (canAddOrderItemResult.TryPickT1(out var error, out var _))
        {
            throw new Exception(error);
        }

        var orderItem = OrderItemFactory.BuildNewOrderItem(
            id: OrderItemId.ExecuteCreate(id),
            orderId: Id,
            quantity: Quantity.ExecuteCreate(quantity),
            status: OrderItemStatus.Pending,
            productHistoryId: productHistory.Id,
            productId: productHistory.ProductId,
            serialNumber: serialNumber
        );

        var addAmount = Money.ExecuteCreate(productHistory.Price.Value * quantity);

        Total += addAmount;
        OrderItems.Add(orderItem);

        return orderItem.Id;
    }

    public OneOf<OrderItem, string> TryGetOrderItemById(OrderItemId orderItemId)
    {
        var orderItem =  OrderItems.Find(orderItem => orderItem.Id == orderItemId);
        if (orderItem == null)
        {
            return $"Order Item of Id \"{orderItemId}\" does not exist on Order of Id \"{Id}\"";
        }

        return orderItem;
    }

    public OrderItem ExecuteGetOrderItemById(OrderItemId orderItemId)
    {
        var canGetOrderItemResult = TryGetOrderItemById(orderItemId);
        if (canGetOrderItemResult.TryPickT1(out var error, out var orderItem))
        {
            throw new Exception(error);
        }

        return orderItem;
    }
}