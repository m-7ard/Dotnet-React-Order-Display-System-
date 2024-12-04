using Application.Errors;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.MarkFinished;

public class MarkOrderFinishedHandler : IRequestHandler<MarkOrderFinishedCommand, OneOf<MarkOrderFinishedResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;

    public MarkOrderFinishedHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<MarkOrderFinishedResult, List<ApplicationError>>> Handle(MarkOrderFinishedCommand request, CancellationToken cancellationToken)
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

        var result = order.TryMarkFinished();
        if (result.TryPickT1(out var errors, out var _))
        {
            return ApplicationErrorFactory.DomainErrorsToApplicationErrors(errors);
        }

        await _orderRepository.UpdateAsync(order);
        
        return new MarkOrderFinishedResult(orderId: request.OrderId);
    }
}