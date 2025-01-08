using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Read;

public class ReadOrderHandler : IRequestHandler<ReadOrderQuery, OneOf<ReadOrderResult, List<ApplicationError>>>
{
  private readonly OrderExistsValidatorAsync _orderExistsValidator;

    public ReadOrderHandler(OrderExistsValidatorAsync orderExistsValidator)
    {
        _orderExistsValidator = orderExistsValidator;
    }

    public async Task<OneOf<ReadOrderResult, List<ApplicationError>>> Handle(ReadOrderQuery request, CancellationToken cancellationToken)
    {
        var orderExistsResult = await _orderExistsValidator.Validate(request.Id);
        if (orderExistsResult.TryPickT1(out var errors, out var order))
        {
            return errors;
        }

        var result = new ReadOrderResult(order: order);
        return result;
    }
}