using Application.Errors;
using Domain.Models;
using OneOf;

namespace Application.Validators.LatestProductHistoryExistsValidator;

public interface ILatestProductHistoryExistsValidator<InputType> 
{
    public Task<OneOf<ProductHistory, List<ApplicationError>>> Validate(InputType input);
}