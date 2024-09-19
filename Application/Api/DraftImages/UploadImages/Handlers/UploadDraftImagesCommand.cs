using Application.ErrorHandling.Application;
using MediatR;
using Microsoft.AspNetCore.Http;
using OneOf;

namespace Application.Api.DraftImages.UploadImages.Handlers;

public class UploadDraftImagesCommand : IRequest<OneOf<UploadDraftImagesResult, List<PlainApplicationError>>>
{
    public UploadDraftImagesCommand(List<IFormFile> files)
    {
        Files = files;
    }

    public List<IFormFile> Files { get; set; }
}