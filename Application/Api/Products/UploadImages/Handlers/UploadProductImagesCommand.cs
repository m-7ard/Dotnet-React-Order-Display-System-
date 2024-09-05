using Application.ErrorHandling.Application;
using MediatR;
using Microsoft.AspNetCore.Http;
using OneOf;

namespace Application.Api.Products.UploadImages.Handlers;

public class UploadProductImagesCommand : IRequest<OneOf<UploadProductImagesResult, List<PlainApplicationError>>>
{
    public UploadProductImagesCommand(List<IFormFile> files)
    {
        Files = files;
    }

    public List<IFormFile> Files { get; set; }
}