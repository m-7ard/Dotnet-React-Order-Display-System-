using Application.Common;
using Application.ErrorHandling.Application;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using MediatR;
using OneOf;

namespace Application.Api.Products.UploadImages.Handlers;

public class UploadProductImagesHandler : IRequestHandler<UploadProductImagesCommand, OneOf<UploadProductImagesResult, List<PlainApplicationError>>>
{
    private readonly IProductImageRepository _ProductImageRepository;

    public UploadProductImagesHandler(IProductImageRepository kitchenTaskRepository)
    {
        _ProductImageRepository = kitchenTaskRepository;
    }

    public async Task<OneOf<UploadProductImagesResult, List<PlainApplicationError>>> Handle(UploadProductImagesCommand request, CancellationToken cancellationToken)
    {
        var images = new List<ProductImage>();

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

                var newImage = await _ProductImageRepository.CreateAsync(
                    ProductImageFactory.BuildNewProductImage(
                        fileName: generatedFileName
                    )
                );

                images.Add(newImage);
            }
        }

        return new UploadProductImagesResult(productImages: images);
    }
}