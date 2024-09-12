using Domain.Models;

namespace Application.Api.Orders.Read.Handlers;

public class ReadOrderResult
{
    public ReadOrderResult(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}