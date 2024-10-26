using Domain.Models;

namespace Application.Handlers.Orders.MarkFinished;

public class MarkOrderFinishedResult
{
    public MarkOrderFinishedResult(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}