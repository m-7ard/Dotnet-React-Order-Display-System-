using Domain.Models;

namespace Application.Validators.OrderItemExistsValidator;

public interface IOrderItemExistsValidatorFactory<InputType> 
{
    public IOrderItemExistsValidator<InputType> Create(Order order);
}