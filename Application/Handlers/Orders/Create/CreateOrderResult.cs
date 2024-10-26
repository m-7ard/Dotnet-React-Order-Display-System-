using Domain.Models;

namespace Application.Handlers.Orders.Create;

public class CreateOrderResult
{
    public CreateOrderResult(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}