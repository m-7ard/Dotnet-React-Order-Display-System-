using Application.Errors;
using OneOf;

namespace Application.Validators;

public interface IValidatorAsync<Input, Success>
{
    public Task<OneOf<Success, List<ApplicationError>>> Validate(Input input);
}