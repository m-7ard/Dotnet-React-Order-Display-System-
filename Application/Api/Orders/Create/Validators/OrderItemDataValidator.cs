using Application.Api.Orders.Create.Other;
using FluentValidation;

namespace Application.Api.Orders.Create.Validators;

public class OrderItemDataValidator : AbstractValidator<OrderItemData>
{
    public OrderItemDataValidator()
    {
        RuleFor(x => x)
            .NotEmpty()
            .WithMessage("Invalid data format");

        RuleFor(x => x.ProductId)
            .NotEmpty()
            .GreaterThan(0);
        
        RuleFor(x => x.Quantity)
            .NotEmpty()
            .GreaterThan(0);
    }
}