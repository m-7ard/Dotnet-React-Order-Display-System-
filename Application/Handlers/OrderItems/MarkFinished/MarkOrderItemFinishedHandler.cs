using Application.Errors;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Handlers.OrderItems.MarkFinished;

public class MarkOrderItemFinishedHandler : IRequestHandler<MarkOrderItemFinishedCommand, OneOf<MarkOrderItemFinishedResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;

    public MarkOrderItemFinishedHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<MarkOrderItemFinishedResult, List<ApplicationError>>> Handle(MarkOrderItemFinishedCommand request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(id: request.OrderId);
        if (order is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Order with Id \"{request.OrderId}\" does not exist.",
                path: ["_"],
                code: ApplicationErrorCodes.ModelDoesNotExist
            );
        }

        var result = order.TryMarkOrderItemFinished(request.OrderItemId);
        if (result.TryPickT1(out var errors, out var _))
        {
            return ApplicationErrorFactory.DomainErrorsToApplicationErrors(errors);
        }

        await _orderRepository.UpdateAsync(order);
        return new MarkOrderItemFinishedResult(orderId: request.OrderId, orderItemId: request.OrderItemId);
    }
}