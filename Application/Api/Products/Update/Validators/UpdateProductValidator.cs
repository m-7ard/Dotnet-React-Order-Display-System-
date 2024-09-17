using Application.Api.Products.Update.DTOs;
using FluentValidation;

namespace Application.Api.Products.Update.Validators;

public class UpdateProductValidator : AbstractValidator<UpdateProductRequestDTO>
{
    public UpdateProductValidator()
    {
        RuleFor(x => x)
            .NotNull()
            .WithMessage("Invalid data format");

        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(1)
            .MaximumLength(1028);

        RuleFor(x => x.Price)
            .GreaterThan(0);

        RuleFor(x => x.Description)
            .MaximumLength(1028);
    }
}