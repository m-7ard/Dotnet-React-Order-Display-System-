namespace Application.Handlers.OrderItems.MarkFinished;

public class MarkOrderItemFinishedResult
{
    public MarkOrderItemFinishedResult(Guid orderId, Guid orderItemId)
    {
        OrderId = orderId;
        OrderItemId = orderItemId;
    }

    public Guid OrderId { get; set; }
    public Guid OrderItemId { get; set; }
}