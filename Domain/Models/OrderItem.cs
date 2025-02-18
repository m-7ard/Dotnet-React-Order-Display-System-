using Domain.Contracts.OrderItems;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;
using Domain.ValueObjects.Shared;
using OneOf;

namespace Domain.Models;
public class OrderItem
{
    public OrderItem(OrderItemId id, Quantity quantity, OrderItemStatus status, ProductHistoryId productHistoryId, ProductId productId, int serialNumber, OrderItemDates orderItemDates)
    {
        Id = id;
        Quantity = quantity;
        Status = status;
        ProductHistoryId = productHistoryId;
        ProductId = productId;
        SerialNumber = serialNumber;
        OrderItemDates = orderItemDates;
    }

    public OrderItemId Id { get; private set; }
    public int SerialNumber { get; private set; }
    public Quantity Quantity { get; set; }
    public OrderItemStatus Status { get; set; }
    public OrderItemDates OrderItemDates { get; set; }
    public ProductId ProductId { get; set; }
    public ProductHistoryId ProductHistoryId { get; set; }

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

    public static OneOf<bool, string> CanCreate(CreateOrderItemContract contract)
    {
        var canCreateOrderItemId = OrderItemId.CanCreate(contract.Id);
        if (canCreateOrderItemId.TryPickT1(out var error, out _))
        {
            return error;
        }

        var canCreateQuantity = Quantity.CanCreate(contract.Quantity);
        if (canCreateQuantity.TryPickT1(out error, out _))
        {
            return error;
        }

        var canCreateStatus = OrderItemStatus.CanCreate(contract.Status);
        if (canCreateStatus.TryPickT1(out error, out _))
        {
            return error;
        }

        var canCreateDates = OrderItemDates.CanCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        if (canCreateDates.TryPickT1(out error, out _))
        {
            return error;
        }

        return true;
    }

    public static OrderItem ExecuteCreate(CreateOrderItemContract contract)
    {
        var canCreateResult = CanCreate(contract);
        if (canCreateResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        var id = OrderItemId.ExecuteCreate(contract.Id);
        var quantity = Quantity.ExecuteCreate(contract.Quantity);
        var status = OrderItemStatus.ExecuteCreate(contract.Status);
        var orderItemDates = OrderItemDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);

        return new OrderItem(
            id: id, 
            quantity: quantity,
            status: status,
            productHistoryId: contract.ProductHistoryId,
            productId: contract.ProductId,
            serialNumber: contract.SerialNumber,
            orderItemDates: orderItemDates
        );
    }

}