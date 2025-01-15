using Application.Errors;
using Domain.Models;
using OneOf;

namespace Application.Validators.OrderItemExistsValidator;

public interface IOrderItemExistsValidator<InputType> 
{
    public OneOf<OrderItem, List<ApplicationError>> Validate(InputType input);
}