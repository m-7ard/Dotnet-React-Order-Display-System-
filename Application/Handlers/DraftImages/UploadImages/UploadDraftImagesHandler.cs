using Application.Common;
using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.DraftImage;
using MediatR;
using OneOf;

namespace Application.Handlers.DraftImages.UploadImages;

public class UploadDraftImagesHandler : IRequestHandler<UploadDraftImagesCommand, OneOf<UploadDraftImagesResult, List<ApplicationError>>>
{
    private readonly IDraftImageRepository _draftImageRepository;
    private readonly IFileStorage _fileStorage;

    public UploadDraftImagesHandler(IDraftImageRepository draftImageRepository, IFileStorage fileStorage)
    {
        _draftImageRepository = draftImageRepository;
        _fileStorage = fileStorage;
    }

    public async Task<OneOf<UploadDraftImagesResult, List<ApplicationError>>> Handle(UploadDraftImagesCommand request, CancellationToken cancellationToken)
    {
        var images = new List<DraftImage>();
        var errors = new List<ApplicationError>();

        foreach (var file in request.Files)
        {
            var canCreateFileName = DraftImageFileName.CanCreate(file.FileName);
            if (canCreateFileName.TryPickT1(out var error, out _))
            {
                errors.Add(new ApplicationError(message: error, code: ApplicationErrorCodes.NotAllowed, path: [file.FileName]));
            }
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        foreach (var file in request.Files)
        {
            using (Stream stream = file.OpenReadStream())
            {
                var fileExtension = Path.GetExtension(file.FileName);
                var uniqueFileName = Guid.NewGuid().ToString();
                var generatedFileName = $"{uniqueFileName}{fileExtension}";
                var filePath = Path.Combine(DirectoryService.GetMediaDirectory(), generatedFileName);

                await _fileStorage.SaveFile(file, filePath, cancellationToken);

                var draftImage = DraftImageFactory.BuildNewDraftImage(
                    fileName: DraftImageFileName.ExecuteCreate(generatedFileName),
                    originalFileName: DraftImageFileName.ExecuteCreate(file.FileName),
                    url: $"Media/{generatedFileName}"
                );
                var newImage = await _draftImageRepository.CreateAsync(draftImage);
                images.Add(newImage);
            }
        }

        return new UploadDraftImagesResult(draftImages: images);
    }
}