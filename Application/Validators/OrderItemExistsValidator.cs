using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.Models;
using OneOf;

namespace Application.Validators;

public record OrderItemValidationInput(Order Order, Guid OrderItemId);

public class OrderItemExistsValidator : IValidator<OrderItemValidationInput, OrderItem>
{
    public OneOf<OrderItem, List<ApplicationError>> Validate(OrderItemValidationInput input)
    {
        var orderItem = input.Order.GetOrderItemById(input.OrderItemId);

        if (orderItem is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"OrderItem of Id \"{input.OrderItemId}\" does not exist on Order of Id \"{input.Order.Id}\".",
                code: ApplicationValidatorErrorCodes.ORDER_EXISTS_ERROR,
                path: []
            );
        }

        return orderItem;
    }
}