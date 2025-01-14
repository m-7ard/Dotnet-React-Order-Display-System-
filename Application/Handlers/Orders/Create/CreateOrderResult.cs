using Domain.ValueObjects.Order;

namespace Application.Handlers.Orders.Create;

public class CreateOrderResult
{
    public CreateOrderResult(OrderId orderId)
    {
        OrderId = orderId;
    }

    public OrderId OrderId { get; set; }
}