using Application.Common;
using Application.ErrorHandling.Application;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using MediatR;
using OneOf;

namespace Application.Api.DraftImages.UploadImages.Handlers;

public class UploadDraftImagesHandler : IRequestHandler<UploadDraftImagesCommand, OneOf<UploadDraftImagesResult, List<PlainApplicationError>>>
{
    private readonly IDraftImageRepository _draftImageRepository;

    public UploadDraftImagesHandler(IDraftImageRepository draftImageRepository)
    {
        _draftImageRepository = draftImageRepository;
    }

    public async Task<OneOf<UploadDraftImagesResult, List<PlainApplicationError>>> Handle(UploadDraftImagesCommand request, CancellationToken cancellationToken)
    {
        var images = new List<DraftImage>();

        foreach (var file in request.Files)
        {
            using (Stream stream = file.OpenReadStream())
            {
                var fileExtension = Path.GetExtension(file.FileName);
                var uniqueFileName = Guid.NewGuid().ToString();
                var generatedFileName = $"{uniqueFileName}{fileExtension}";
                var filePath = Path.Combine(DirectoryService.GetMediaDirectory(), generatedFileName);

                using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream, cancellationToken);
                }

                var newImage = await _draftImageRepository.CreateAsync(
                    DraftImageFactory.BuildNewDraftImage(
                        fileName: generatedFileName,
                        originalFileName: file.FileName,
                        url: $"Media/{generatedFileName}"
                    )
                );

                images.Add(newImage);
            }
        }

        return new UploadDraftImagesResult(draftImages: images);
    }
}