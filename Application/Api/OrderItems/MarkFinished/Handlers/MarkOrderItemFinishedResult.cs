using Domain.Models;

namespace Application.Api.OrderItems.MarkFinished.Handlers;

public class MarkOrderItemFinishedResult
{
    public MarkOrderItemFinishedResult(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}