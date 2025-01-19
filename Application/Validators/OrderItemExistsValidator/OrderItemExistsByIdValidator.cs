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
        var orderItem = Order.GetOrderItemById(id);

        if (orderItem is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"OrderItem of Id \"{id}\" does not exist on Order of Id \"{Order.Id}\".",
                code: SpecificApplicationErrorCodes.ORDER_ITEM_EXISTS_ERROR,
                path: []
            );
        }

        return orderItem;
    }
}
