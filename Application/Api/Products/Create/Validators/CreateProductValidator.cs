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
            .NotEmpty()
            .MinimumLength(1)
            .MaximumLength(1028);
        
        RuleFor(x => x.Images)
            .Must(images => images.Count <= 8)
            .WithMessage("Only up to 8 images are allowed.");

        RuleFor(x => x.Price)
            .GreaterThan(0);
            
        RuleFor(x => x.Description)
            .MaximumLength(1028);
    }
}