using Application.Errors;
using Domain.Models;
using OneOf;

namespace Application.Validators.DraftImageExistsValidator;

public interface IDraftImageExistsValidator<InputType> 
{
    public Task<OneOf<DraftImage, List<ApplicationError>>> Validate(InputType input);
}