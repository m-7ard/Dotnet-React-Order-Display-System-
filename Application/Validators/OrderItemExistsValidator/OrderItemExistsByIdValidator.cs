using Application.Errors;
using Domain.Models;
using Domain.ValueObjects.OrderItem;
using OneOf;

namespace Application.Validators.OrderItemExistsValidator;

public class OrderItemExistsByIdValidator : IOrderItemExistsValidator<OrderItemId>
{
    private readonly Order Order;

    public OrderItemExistsByIdValidator(Order order)
    {
        Order = order;
    }

    public OneOf<OrderItem, List<ApplicationError>> Validate(OrderItemId id)
    {
        var cangetOrderItemResult = Order.TryGetOrderItemById(id);

        if (cangetOrderItemResult.TryPickT1(out var error, out var orderItem))
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: error,
                code: SpecificApplicationErrorCodes.ORDER_ITEM_EXISTS_ERROR,
                path: []
            );
        }

        return orderItem;
    }
}
