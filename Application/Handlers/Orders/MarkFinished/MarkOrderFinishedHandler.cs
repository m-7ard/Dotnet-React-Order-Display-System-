using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using Domain.DomainService;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.MarkFinished;

public class MarkOrderFinishedHandler : IRequestHandler<MarkOrderFinishedCommand, OneOf<MarkOrderFinishedResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;
  private readonly OrderExistsValidatorAsync _orderExistsValidator;

    public MarkOrderFinishedHandler(IOrderRepository orderRepository, OrderExistsValidatorAsync orderExistsValidator)
    {
        _orderRepository = orderRepository;
        _orderExistsValidator = orderExistsValidator;
    }

    public async Task<OneOf<MarkOrderFinishedResult, List<ApplicationError>>> Handle(MarkOrderFinishedCommand request, CancellationToken cancellationToken)
    {
        var orderExistsResult = await _orderExistsValidator.Validate(request.OrderId);
        if (orderExistsResult.TryPickT1(out var errors, out var order))
        {
            return errors;
        }

        var canMarkOrderFinishedResult = OrderDomainService.CanMarkFinished(order);
        if (canMarkOrderFinishedResult.TryPickT1(out var error, out var _))
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: error,
                path: [],
                code: ApplicationErrorCodes.NotAllowed
            );
        }

        OrderDomainService.ExecuteMarkFinished(order);
        await _orderRepository.UpdateAsync(order);
        return new MarkOrderFinishedResult(orderId: request.OrderId);
    }
}