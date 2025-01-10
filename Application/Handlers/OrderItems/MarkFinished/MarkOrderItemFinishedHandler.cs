using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using Domain.DomainService;
using MediatR;
using OneOf;

namespace Application.Handlers.OrderItems.MarkFinished;

public class MarkOrderItemFinishedHandler : IRequestHandler<MarkOrderItemFinishedCommand, OneOf<MarkOrderItemFinishedResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly OrderExistsValidatorAsync _orderExistsValidator;

    public MarkOrderItemFinishedHandler(IOrderRepository orderRepository, OrderExistsValidatorAsync orderExistsValidator)
    {
        _orderRepository = orderRepository;
        _orderExistsValidator = orderExistsValidator;
    }

    public async Task<OneOf<MarkOrderItemFinishedResult, List<ApplicationError>>> Handle(MarkOrderItemFinishedCommand request, CancellationToken cancellationToken)
    {
        var orderExistsResult = await _orderExistsValidator.Validate(request.OrderId);
        if (orderExistsResult.TryPickT1(out var errors, out var order))
        {
            return errors;
        }

        var canMarkOrderItemFinishedResult = OrderDomainService.CanMarkOrderItemFinished(order, request.OrderItemId);
        if (canMarkOrderItemFinishedResult.TryPickT1(out var error, out var _))
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: error,
                path: [],
                code: ApplicationErrorCodes.NotAllowed
            );
        }

        var dateFinished = OrderDomainService.ExecuteMarkOrderItemFinished(order, request.OrderItemId);
        await _orderRepository.UpdateAsync(order);
        return new MarkOrderItemFinishedResult(orderId: request.OrderId, orderItemId: request.OrderItemId, dateFinished: dateFinished);
    }
}