using Domain.DomainEvents;
using Domain.DomainFactories;
using Domain.Errors;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using OneOf;

namespace Domain.Models;
public class Order
{
    public Order(Guid id, decimal total, List<OrderItem> orderItems, OrderStatus status, int serialNumber, OrderDates orderDates)
    {
        Id = id;
        Total = total;
        OrderItems = orderItems;
        Status = status;
        SerialNumber = serialNumber;
        OrderDates = orderDates;
    }

    public Guid Id { get; private set; }
    public int SerialNumber { get; private set; }
    public decimal Total { get; set; }
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

    public OneOf<bool, string> CanAddOrderItem(Product product, ProductHistory productHistory, int quantity)
    {
        if (product.Id != productHistory.ProductId)
        {
            return "Product History's Product Id does not match Product Id.";
        }

        if (!productHistory.IsValid())
        {
            return $"Product History for Product of Id \"{product.Id}\" is not valid.";
        }

        if (quantity <= 0)
        {
            return "Order Item quantity must be greater than 0";
        }

        var existingOrderItem = OrderItems.Find(orderItem => orderItem.ProductId == product.Id);
        if (existingOrderItem is not null)
        {
            return "Product has already been added as an Order Item.";
        }

        return true;
    }

    public OrderItem ExecuteAddOrderItem(Product product, ProductHistory productHistory, int quantity, int serialNumber) 
    {
        var canAddOrderItemResult = CanAddOrderItem(product: product, productHistory: productHistory, quantity: quantity);
        if (canAddOrderItemResult.TryPickT1(out var error, out var _))
        {
            throw new Exception(error);
        }

        var orderItem = OrderItemFactory.BuildNewOrderItem(
            id: Guid.NewGuid(),
            orderId: Id,
            quantity: quantity,
            status: OrderItemStatus.Pending,
            productHistoryId: productHistory.Id,
            productId: productHistory.ProductId,
            serialNumber: serialNumber
        );

        Total += productHistory.Price * quantity;
        OrderItems.Add(orderItem);

        return orderItem;
    }

    public OrderItem? GetOrderItemById(Guid id)
    {
        return OrderItems.Find(orderItem => orderItem.Id == id);
    }
}