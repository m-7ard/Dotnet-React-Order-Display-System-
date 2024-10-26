using Application.ErrorHandling.Application;
using Application.ErrorHandling.Other;
using Application.Interfaces.Persistence;
using Domain.ValueObjects.OrderItem;
using MediatR;
using OneOf;

namespace Application.Handlers.OrderItems.MarkFinished;

public class MarkOrderItemFinishedHandler : IRequestHandler<MarkOrderItemFinishedCommand, OneOf<MarkOrderItemFinishedResult, List<PlainApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;

    public MarkOrderItemFinishedHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<MarkOrderItemFinishedResult, List<PlainApplicationError>>> Handle(MarkOrderItemFinishedCommand request, CancellationToken cancellationToken)
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

        var orderItem = order.OrderItems.Find(orderItem => orderItem.Id == request.OrderItemId);
        if (orderItem is null)
        {
            return new List<PlainApplicationError>() {
                new PlainApplicationError(
                    message: $"OrderItem with Id \"{request.OrderItemId}\" does not exist does not exist in Order of id \"{request.OrderId}\".",
                    path: ["_"],
                    code: ValidationErrorCodes.ModelDoesNotExist
                )
            };
        }

        if (orderItem.Status == OrderItemStatus.Finished)
        {
            return new List<PlainApplicationError>() {
                new PlainApplicationError(
                    message: $"OrderItem with Id \"{request.OrderItemId}\" is already finished.",
                    path: ["_"],
                    code: ValidationErrorCodes.StateMismatch
                )
            };
        }

        order.UpdateOrderItemStatus(orderItemId: orderItem.Id, OrderItemStatus.Finished);
        await _orderRepository.UpdateAsync(order);

        var result = new MarkOrderItemFinishedResult(order: order);
        return result;
    }
}