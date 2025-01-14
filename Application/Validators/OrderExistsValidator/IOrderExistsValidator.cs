using Application.Errors;
using Domain.Models;
using OneOf;

namespace Application.Validators.OrderExistsValidator;

public interface IOrderExistsValidator<InputType> 
{
    public Task<OneOf<Order, List<ApplicationError>>> Validate(InputType input);
}