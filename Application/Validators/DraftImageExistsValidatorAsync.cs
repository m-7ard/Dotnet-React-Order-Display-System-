using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.Models;
using OneOf;

namespace Application.Validators;

public class DraftImageExistsValidatorAsync : IValidatorAsync<string, DraftImage>
{
    private readonly IDraftImageRepository _draftImageRepository;

    public DraftImageExistsValidatorAsync(IDraftImageRepository draftImageRepository)
    {
        _draftImageRepository = draftImageRepository;
    }

    public async Task<OneOf<DraftImage, List<ApplicationError>>> Validate(string input)
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