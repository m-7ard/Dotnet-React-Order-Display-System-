using Application.Errors;
using Domain.Models;
using OneOf;

namespace Application.Validators.ProductExistsValidator;

public interface IProductHistoryExistsValidator<InputType> 
{
    public Task<OneOf<ProductHistory, List<ApplicationError>>> Validate(InputType input);
}