using Domain.Models;

namespace Application.Handlers.OrderItems.MarkFinished;

public class MarkOrderItemFinishedResult
{
    public MarkOrderItemFinishedResult(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}