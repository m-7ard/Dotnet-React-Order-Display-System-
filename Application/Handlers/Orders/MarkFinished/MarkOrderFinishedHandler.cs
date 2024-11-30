using Application.ErrorHandling.Application;
using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.MarkFinished;

public class MarkOrderFinishedHandler : IRequestHandler<MarkOrderFinishedCommand, OneOf<MarkOrderFinishedResult, List<PlainApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;

    public MarkOrderFinishedHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<MarkOrderFinishedResult, List<PlainApplicationError>>> Handle(MarkOrderFinishedCommand request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(id: request.OrderId);
        if (order is null)
        {
            return new List<PlainApplicationError>() {
                new PlainApplicationError(
                    message: $"Order with Id \"{request.OrderId}\" does not exist.",
                    path: ["_"],
                    code: ValidationErrorCodes.ModelDoesNotExist
                )
            };
        }

        if (order.OrderItems.Any(d => d.Status != OrderItemStatus.Finished))
        {
            return new List<PlainApplicationError>() {
                new PlainApplicationError(
                    message: $"All OrderItems must be finished in order to mark it as finished.",
                    path: ["_"],
                    code: ValidationErrorCodes.StateMismatch
                )
            };
        }

        if (order.Status == OrderStatus.Finished)
        {
            return new List<PlainApplicationError>() {
                new PlainApplicationError(
                    message: $"Order is already finished.",
                    path: ["_"],
                    code: ValidationErrorCodes.StateMismatch
                )
            };
        }

        order.UpdateStatus(OrderStatus.Finished);
        await _orderRepository.UpdateAsync(order);

        var result = new MarkOrderFinishedResult(order: order);
        return result;
    }
}