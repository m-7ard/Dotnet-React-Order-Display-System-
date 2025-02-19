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
    public Order(OrderId id, int serialNumber, Money total, OrderSchedule orderSchedule, List<OrderItem> orderItems)
    {
        Id = id;
        SerialNumber = serialNumber;
        Total = total;
        OrderSchedule = orderSchedule;
        OrderItems = orderItems;
    }

    public OrderId Id { get; private set; }
    public int SerialNumber { get; private set; }
    public Money Total { get; set; }
    public OrderSchedule OrderSchedule { get; set; }
    public List<OrderItem> OrderItems { get; set; }

    public List<DomainEvent> DomainEvents { get; set; } = [];
    public void ClearEvents()
    {
        DomainEvents = [];
    }

    private readonly Dictionary<OrderStatus, List<OrderStatus>> _validStatusStatusTransitions = new()
    {
        { OrderStatus.Pending, [OrderStatus.Finished] },
        { OrderStatus.Finished, [] },
    };

    public OneOf<bool, string> CanTransitionStatus(TransitionStatusContract contract)
    {
        // OrderStatus
        var canCreateStatus = OrderStatus.CanCreate(contract.Status);
        if (canCreateStatus.IsT1) return canCreateStatus.AsT1;

        var newStatus = OrderStatus.ExecuteCreate(contract.Status);

        var currentStatus = OrderSchedule.Status;
        if (!_validStatusStatusTransitions.TryGetValue(currentStatus, out var transitionList)) return $"No transitions exist for status \"{currentStatus}\".";

        var transitionExists = transitionList.Exists(status => status == newStatus); 
        if (!transitionExists) return $"Invalid status transition from {currentStatus} to {newStatus}.";


        // OrderDates
        var canCreateDates = OrderDates.CanCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        if (canCreateDates.IsT1) return canCreateDates.AsT1;

        var newOrderDates = OrderDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished); 


        // OrderSchedule
        var canCreateSchedule = OrderSchedule.CanCreate(newStatus, newOrderDates);
        if (canCreateSchedule.IsT1) return canCreateSchedule.AsT1;


        return true;
    }

    public void ExecuteTransitionStatus(TransitionStatusContract contract)
    {
        var canTransitionStatus = CanTransitionStatus(contract);
        if (canTransitionStatus.IsT1)
        {
            throw new Exception(canTransitionStatus.AsT1);
        }

        var newStatus = OrderStatus.ExecuteCreate(contract.Status);
        var newOrderDates = OrderDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished); 
        var newSchedule = OrderSchedule.ExecuteCreate(newStatus, newOrderDates);
        OrderSchedule = newSchedule;
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

    public static OneOf<bool, string> CanCreate(CreateOrderContract contract)
    {
        var canCreateId = OrderId.CanCreate(contract.Id);
        if (canCreateId.IsT1) return canCreateId.AsT1;

        var canCreateTotal = Money.CanCreate(contract.Total);
        if (canCreateTotal.IsT1) return canCreateTotal.AsT1;
        
        var canCreateStatus = OrderStatus.CanCreate(contract.Status);
        if (canCreateStatus.IsT1) return canCreateStatus.AsT1;
        
        var canCreateDates = OrderDates.CanCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        if (canCreateDates.IsT1) return canCreateDates.AsT1;

        // Relationships
        var status = OrderStatus.ExecuteCreate(contract.Status);
        var dates = OrderDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        var canCreateSchedule = OrderSchedule.CanCreate(status: status, dates: dates);
        if (canCreateSchedule.IsT1) return canCreateSchedule.AsT1;
        
        return true;
    }

    public static Order ExecuteCreate(CreateOrderContract contract)
    {
        var id = OrderId.ExecuteCreate(contract.Id);
        var total = Money.ExecuteCreate(contract.Total);
        var status = OrderStatus.ExecuteCreate(contract.Status);
        var dates = OrderDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        var schedule = OrderSchedule.ExecuteCreate(status: status, dates: dates);

        return new Order(
            id: id,
            serialNumber: contract.SerialNumber,
            total: total,
            orderSchedule: schedule,
            orderItems: contract.OrderItems
        );
    }
}