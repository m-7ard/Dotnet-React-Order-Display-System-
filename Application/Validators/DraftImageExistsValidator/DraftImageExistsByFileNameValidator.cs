using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.DraftImage;
using OneOf;

namespace Application.Validators.DraftImageExistsValidator;

public class DraftImageExistsByFileNameValidator : IDraftImageExistsValidator<FileName>
{
    private readonly IDraftImageRepository _draftImageRepository;

    public DraftImageExistsByFileNameValidator(IDraftImageRepository draftImageRepository)
    {
        _draftImageRepository = draftImageRepository;
    }

    public async Task<OneOf<DraftImage, List<ApplicationError>>> Validate(FileName input)
    {
        var draftImage = await _draftImageRepository.GetByFileNameAsync(input);

        if (draftImage is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"DraftImage of fileName \"{input}\" does not exist.",
                code: ApplicationValidatorErrorCodes.DRAFT_IMAGE_EXISTS_ERROR,
                path: []
            );
        }

        return draftImage;
    }
}
