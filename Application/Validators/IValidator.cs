using Application.Errors;
using OneOf;

namespace Application.Validators;

public interface IValidator<Input, Success>
{
    public OneOf<Success, List<ApplicationError>> Validate(Input input);
}