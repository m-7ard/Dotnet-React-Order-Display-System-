using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.MarkFinished;

public class MarkOrderFinishedCommand : IRequest<OneOf<MarkOrderFinishedResult, List<PlainApplicationError>>>
{
    public MarkOrderFinishedCommand(int orderId)
    {
        OrderId = orderId;
    }

    public int OrderId { get; set; }
}