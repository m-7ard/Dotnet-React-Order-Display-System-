using Application.ErrorHandling.Application;
using Application.Interfaces.Persistence;
using Domain.ValueObjects.Order;
using MediatR;
using OneOf;

namespace Application.Api.Orders.List.Handlers;

public class ListOrdersHandler : IRequestHandler<ListOrdersQuery, OneOf<ListOrdersResult, List<PlainApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;

    public ListOrdersHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<ListOrdersResult, List<PlainApplicationError>>> Handle(ListOrdersQuery request, CancellationToken cancellationToken)
    {
        var orders = await _orderRepository.FindAllAsync(
            minTotal: request.MinTotal,
            maxTotal: request.MaxTotal,
            status: (request.Status is null || !OrderStatus.IsValid(request.Status)) ? null : new OrderStatus(name: request.Status),
            createdBefore: request.CreatedBefore,
            createdAfter: request.CreatedAfter
        );

        var result = new ListOrdersResult(orders: orders);
        return result;
    }
}