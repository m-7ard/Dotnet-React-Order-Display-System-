using Domain.Contracts.OrderItems;
using Domain.Contracts.Orders;
using Domain.DomainEvents;
using Domain.DomainEvents.Order;
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

    public OneOf<bool, string> CanAddOrderItem(AddOrderItemContract contract)
    {
        // Order Item
        var createOrderItemContract = new CreateOrderItemContract(
            id: contract.Id,
            productId: contract.Product.Id,
            productHistoryId: contract.ProductHistory.Id,
            quantity: contract.Quantity,
            status: contract.Status,
            serialNumber: contract.SerialNumber,
            dateCreated: contract.DateCreated,
            dateFinished: contract.DateFinished
        );

        var canCreateOrderItem = OrderItem.CanCreate(createOrderItemContract);
        if (canCreateOrderItem.TryPickT1(out var error, out _))
        {
            return error;
        }

        var productHistory = contract.ProductHistory;
        var product = contract.Product;

        if (!productHistory.IsValid())
        {
            return $"Product History for Product of Id \"{product.Id}\" is not valid.";
        }

        var existingOrderItem = OrderItems.Find(orderItem => orderItem.ProductId == product.Id);
        if (existingOrderItem is not null)
        {
            return "Product has already been added as an Order Item.";
        }

        // Order
        var canCreateTotal = Money.CanCreate(contract.ProductHistory.Price.Value * contract.Quantity);
        if (canCreateTotal.TryPickT1(out error, out _))
        {
            return error;
        }

        var canLowerAmount = contract.Product.CanLowerAmount(contract.Quantity);
        if (canLowerAmount.TryPickT1(out error, out _))
        {
            return $"Order Item quantity ({contract.Quantity}) cannot be larger than Product amount ({product.Amount})";
        }

        return true;
    }

    public OrderItemId ExecuteAddOrderItem(AddOrderItemContract contract) 
    {
        var canAddOrderItemResult = CanAddOrderItem(contract);
        if (canAddOrderItemResult.TryPickT1(out var error, out var _))
        {
            throw new Exception(error);
        }

        var createOrderItemContract = new CreateOrderItemContract(
            id: contract.Id,
            productId: contract.Product.Id,
            productHistoryId: contract.ProductHistory.Id,
            quantity: contract.Quantity,
            status: contract.Status,
            serialNumber: contract.SerialNumber,
            dateCreated: contract.DateCreated,
            dateFinished: contract.DateFinished
        );

        var orderItem = OrderItem.ExecuteCreate(createOrderItemContract);
        OrderItems.Add(orderItem);
        DomainEvents.Add(new OrderItemCreatedEvent(orderItem));

        var productHistory = contract.ProductHistory;
        var addAmount = Money.ExecuteCreate(productHistory.Price.Value * contract.Quantity);
        Total += addAmount;

        contract.Product.ExecuteLowerAmount(contract.Quantity);

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