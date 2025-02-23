using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using Application.Validators.OrderExistsValidator;
using Domain.DomainExtension;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.Product;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.MarkFinished;

public class MarkOrderFinishedHandler : IRequestHandler<MarkOrderFinishedCommand, OneOf<MarkOrderFinishedResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderExistsValidator<OrderId> _orderExistsValidator;

    public MarkOrderFinishedHandler(IOrderRepository orderRepository, IOrderExistsValidator<OrderId> orderExistsValidator)
    {
        _orderRepository = orderRepository;
        _orderExistsValidator = orderExistsValidator;
    }

    public async Task<OneOf<MarkOrderFinishedResult, List<ApplicationError>>> Handle(MarkOrderFinishedCommand request, CancellationToken cancellationToken)
    {
        var orderId = OrderId.ExecuteCreate(request.OrderId);
        var orderExistsResult = await _orderExistsValidator.Validate(orderId);
        if (orderExistsResult.TryPickT1(out var errors, out var order))
        {
            return errors;
        }

        var canMarkOrderFinishedResult = OrderDomainExtension.CanMarkFinished(order);
        if (canMarkOrderFinishedResult.TryPickT1(out var error, out var _))
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: error,
                path: [],
                code: GeneralApplicationErrorCodes.NOT_ALLOWED
            );
        }

        var dateFinished = OrderDomainExtension.ExecuteMarkFinished(order);
        await _orderRepository.UpdateAsync(order);
        return new MarkOrderFinishedResult(orderId: request.OrderId, dateFinished: dateFinished);
    }
}