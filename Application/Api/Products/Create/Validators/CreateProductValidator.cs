using Application.Api.Products.Create.DTOs;
using FluentValidation;

namespace Application.Api.Products.Create.Validators;

public class CreateProductValidator : AbstractValidator<CreateProductRequestDTO>
{
    public CreateProductValidator()
    {
        RuleFor(x => x)
            .NotNull()
            .WithMessage("Invalid data format");

        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(1)
            .MaximumLength(1028);
        
        RuleFor(x => x.Price)
            .GreaterThan(0)
            .Custom((value, context) => {
                var asString = value.ToString();
                if (!asString.Contains('.') || asString.Split('.')[1].Length <= 2)
                {
                    return;
                }

                context.AddFailure("Price cannot have more than 2 decimal places.");
            });
            
        RuleFor(x => x.Description)
            .MaximumLength(1028);
    }
}