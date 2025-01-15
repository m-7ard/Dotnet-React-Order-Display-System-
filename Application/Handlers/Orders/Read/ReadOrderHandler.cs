using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using Application.Validators.OrderExistsValidator;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.Product;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Read;

public class ReadOrderHandler : IRequestHandler<ReadOrderQuery, OneOf<ReadOrderResult, List<ApplicationError>>>
{
    private readonly IOrderExistsValidator<OrderId> _orderExistsValidator;

    public ReadOrderHandler(IOrderExistsValidator<OrderId> orderExistsValidator)
    {
        _orderExistsValidator = orderExistsValidator;
    }

    public async Task<OneOf<ReadOrderResult, List<ApplicationError>>> Handle(ReadOrderQuery request, CancellationToken cancellationToken)
    {
        var orderId = OrderId.ExecuteCreate(request.Id);
        var orderExistsResult = await _orderExistsValidator.Validate(orderId);
        if (orderExistsResult.TryPickT1(out var errors, out var order))
        {
            return errors;
        }

        var result = new ReadOrderResult(order: order);
        return result;
    }
}