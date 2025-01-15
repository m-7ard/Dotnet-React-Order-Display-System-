using Domain.Models;
using Domain.ValueObjects.OrderItem;

namespace Application.Validators.OrderItemExistsValidator;

public class OrderItemExistsByIdValidatorFactory : IOrderItemExistsValidatorFactory<OrderItemId>
{
    public IOrderItemExistsValidator<OrderItemId> Create(Order order)
    {
        return new OrderItemExistsByIdValidator(order);
    }
}
