using Domain.Models;

namespace Application.Api.Orders.Create.Handlers;

public class CreateOrderResult
{
    public CreateOrderResult(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}