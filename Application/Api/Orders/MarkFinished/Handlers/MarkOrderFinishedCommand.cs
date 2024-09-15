using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Orders.MarkFinished.Handlers;

public class MarkOrderFinishedCommand : IRequest<OneOf<MarkOrderFinishedResult, List<PlainApplicationError>>>
{
    public MarkOrderFinishedCommand(int orderId)
    {
        OrderId = orderId;
    }

    public int OrderId { get; set; }
}