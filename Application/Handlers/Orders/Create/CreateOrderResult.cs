using Domain.ValueObjects.Order;
using Domain.ValueObjects.Product;

namespace Application.Handlers.Orders.Create;

public class CreateOrderResult
{
    public CreateOrderResult(OrderId orderId)
    {
        OrderId = orderId;
    }

    public OrderId OrderId { get; set; }
}