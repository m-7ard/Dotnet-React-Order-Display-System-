using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Handlers.OrderItems.MarkFinished;

public class MarkOrderItemFinishedCommand : IRequest<OneOf<MarkOrderItemFinishedResult, List<PlainApplicationError>>>
{
    public MarkOrderItemFinishedCommand(int orderId, int orderItemId)
    {
        OrderId = orderId;
        OrderItemId = orderItemId;
    }

    public int OrderId { get; set; }
    public int OrderItemId { get; set; }
}