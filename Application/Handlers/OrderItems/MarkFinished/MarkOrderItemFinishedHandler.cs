using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators.OrderExistsValidator;
using Domain.DomainExtension;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using MediatR;
using OneOf;

namespace Application.Handlers.OrderItems.MarkFinished;

public class MarkOrderItemFinishedHandler : IRequestHandler<MarkOrderItemFinishedCommand, OneOf<MarkOrderItemFinishedResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderExistsValidator<OrderId> _orderExistsValidator;


    public MarkOrderItemFinishedHandler(IOrderRepository orderRepository, IOrderExistsValidator<OrderId> orderExistsValidator)
    {
        _orderRepository = orderRepository;
        _orderExistsValidator = orderExistsValidator;
    }

    public async Task<OneOf<MarkOrderItemFinishedResult, List<ApplicationError>>> Handle(MarkOrderItemFinishedCommand request, CancellationToken cancellationToken)
    {
        var orderId = OrderId.ExecuteCreate(request.OrderId);
        var orderExistsResult = await _orderExistsValidator.Validate(orderId);
        if (orderExistsResult.TryPickT1(out var errors, out var order))
        {
            return errors;
        }

        var orderItemId = OrderItemId.ExecuteCreate(request.OrderItemId);
        var canMarkOrderItemFinishedResult = OrderDomainExtension.CanMarkOrderItemFinished(order, orderItemId);
        if (canMarkOrderItemFinishedResult.TryPickT1(out var error, out var _))
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: error,
                path: [],
                code: GeneralApplicationErrorCodes.NOT_ALLOWED
            );
        }

        var dateFinished = OrderDomainExtension.ExecuteMarkOrderItemFinished(order, orderItemId);
        await _orderRepository.UpdateAsync(order);
        return new MarkOrderItemFinishedResult(orderId: request.OrderId, orderItemId: request.OrderItemId, dateFinished: dateFinished);
    }
}