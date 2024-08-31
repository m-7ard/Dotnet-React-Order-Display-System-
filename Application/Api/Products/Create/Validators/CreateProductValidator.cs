using Application.Api.Products.Create.DTOs;
using FluentValidation;

namespace Application.Api.Products.Create.Validators;

public class CreateProductValidator : AbstractValidator<CreateProductRequestDTO>
{
    public CreateProductValidator()
    {
        RuleFor(x => x)
            .NotEmpty()
            .WithMessage("Invalid data format");

        RuleFor(x => x.Name)
            .NotEmpty();
    }
}