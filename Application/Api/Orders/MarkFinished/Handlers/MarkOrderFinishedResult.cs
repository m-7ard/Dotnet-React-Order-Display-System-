using Domain.Models;

namespace Application.Api.Orders.MarkFinished.Handlers;

public class MarkOrderFinishedResult
{
    public MarkOrderFinishedResult(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}