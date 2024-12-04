using Domain.Models;

namespace Application.Handlers.Orders.MarkFinished;

public class MarkOrderFinishedResult
{
    public MarkOrderFinishedResult(Guid orderId)
    {
        OrderId = orderId;
    }

    public Guid OrderId { get; set; }
}