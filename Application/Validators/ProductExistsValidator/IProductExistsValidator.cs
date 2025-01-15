using Application.Errors;
using Domain.Models;
using OneOf;

namespace Application.Validators.ProductExistsValidator;

public interface IProductExistsValidator<InputType> 
{
    public Task<OneOf<Product, List<ApplicationError>>> Validate(InputType input);
}