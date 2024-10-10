using Application.ErrorHandling.Application;
using Application.ErrorHandling.Other;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using MediatR;
using OneOf;

namespace Application.Api.Products.Create.Handlers;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, OneOf<CreateProductResult, List<PlainApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IDraftImageRepository _draftImageRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;

    public CreateProductHandler(IProductRepository productRepository, IDraftImageRepository draftImageRepository, IProductHistoryRepository productHistoryRepository)
    {
        _productRepository = productRepository;
        _draftImageRepository = draftImageRepository;
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<CreateProductResult, List<PlainApplicationError>>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var errors = new List<PlainApplicationError>();

        var draftImages = new List<DraftImage>();
        foreach (var fileName in request.Images)
        {
            var draftImage = await _draftImageRepository.GetByFileNameAsync(fileName);
            if (draftImage is null)
            {
                errors.Add(new PlainApplicationError(
                    message: $"DraftImage of fileName \"{fileName}\" does not exist.",
                    path: ["images", fileName],
                    code: ValidationErrorCodes.ModelDoesNotExist
                ));
                continue;
            }

            draftImages.Add(draftImage);
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        var inputProduct = ProductFactory.BuildNewProduct(
            name: request.Name,
            price: request.Price,
            description: request.Description,
            images: draftImages.Select(ProductImageFactory.BuildNewProductImageFromDraftImage).ToList()
        );

        foreach (var draftImage in draftImages)
        {
            await _draftImageRepository.DeleteByFileNameAsync(draftImage.FileName);
        }

        var outputProduct = await _productRepository.CreateAsync(inputProduct);
        await _productHistoryRepository.CreateAsync(ProductHistoryFactory.BuildNewProductHistoryFromProduct(outputProduct));

        return new CreateProductResult
        (
            product: outputProduct
        );
    }
}