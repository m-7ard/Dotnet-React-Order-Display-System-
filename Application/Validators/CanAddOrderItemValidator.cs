using Application.Errors;
using Domain.Models;
using OneOf;

namespace Application.Validators;

public class CanAddOrderItemValidator : IValidator<CanAddOrderItemValidator.Input, bool>
{
    public Order Order { get; }
    public class Input
    {
        public Input(Product product, ProductHistory productHistory, int quantity)
        {
            Product = product;
            ProductHistory = productHistory;
            Quantity = quantity;
        }

        public Product Product { get; }
        public ProductHistory ProductHistory { get; }
        public int Quantity { get; }
    }

    public CanAddOrderItemValidator(Order order)
    {
        Order = order;
    }

    public OneOf<bool, List<ApplicationError>> Validate(Input input)
    {
        var canAddOrderItemResult = Order.CanAddOrderItem(product: input.Product, productHistory: input.ProductHistory, quantity: input.Quantity);
        if (canAddOrderItemResult.TryPickT1(out var error, out var _))
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: error,
                code: ApplicationValidatorErrorCodes.CAN_ADD_ORDER_ITEM_ERROR,
                path: []
            );
        }

        return true;
    }
}