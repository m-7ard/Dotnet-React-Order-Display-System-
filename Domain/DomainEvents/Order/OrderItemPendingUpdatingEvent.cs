using Domain.Models;

namespace Domain.DomainEvents.Order;

public class OrderItemPendingUpdatingEvent : DomainEvent
{
    public OrderItemPendingUpdatingEvent(OrderItem payload) : base()
    {
        Payload = payload;
    }

    public OrderItem Payload { get; }
    public override string EventType => "ORDER_ITEM_PENDING_UPDATING";
}