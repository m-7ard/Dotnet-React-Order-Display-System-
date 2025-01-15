using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Product;
using OneOf;

namespace Domain.Models;

public class OrderItem
{
    public OrderItem(Guid id, int quantity, OrderItemStatus status, OrderId orderId, Guid productHistoryId, ProductId productId, int serialNumber, OrderItemDates orderItemDates)
    {
        Id = id;
        Quantity = quantity;
        Status = status;
        OrderId = orderId;
        ProductHistoryId = productHistoryId;
        ProductId = productId;
        SerialNumber = serialNumber;
        OrderItemDates = orderItemDates;
    }

    public Guid Id { get; private set; }
    public int SerialNumber { get; private set; }
    public int Quantity { get; set; }
    public OrderItemStatus Status { get; set; }
    public OrderItemDates OrderItemDates { get; set; }
    public OrderId OrderId { get; set; }
    public ProductId ProductId { get; set; }
    public Guid ProductHistoryId { get; set; }

    private Dictionary<string, List<OrderItemStatus>> ValidStatusStatusTransitions = new Dictionary<string, List<OrderItemStatus>>()
    {
        { OrderItemStatus.Pending.Name, [OrderItemStatus.Finished] },
        { OrderItemStatus.Finished.Name, [] },
    };

    public OneOf<OrderItemStatus, string> CanTransitionStatus(string value)
    {
        var statusCreationResult = OrderItemStatus.CanCreate(value);
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

}