using Application.ErrorHandling.Application;
using Application.ErrorHandling.Other;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Api.Orders.Read.Handlers;

public class ReadOrderHandler : IRequestHandler<ReadOrderQuery, OneOf<ReadOrderResult, List<PlainApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;

    public ReadOrderHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<ReadOrderResult, List<PlainApplicationError>>> Handle(ReadOrderQuery request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(id: request.Id);
        if (order is null)
        {
            return new List<PlainApplicationError>() {
                new PlainApplicationError(
                    message: $"Order with Id \"{request.Id}\" does not exist.",
                    path: ["_"],
                    code: ValidationErrorCodes.ModelDoesNotExist
                )
            };
        }

        var result = new ReadOrderResult(order: order);
        return result;
    }
}