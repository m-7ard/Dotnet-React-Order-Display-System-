using Domain.Models;

namespace Application.Api.Orders.List.Handlers;

public class ListOrdersResult
{
    public ListOrdersResult(List<Order> orders)
    {
        Orders = orders;
    }

    public List<Order> Orders { get; set; }
}