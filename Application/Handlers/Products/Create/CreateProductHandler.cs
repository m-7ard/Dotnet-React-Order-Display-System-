using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Create;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, OneOf<CreateProductResult, List<ApplicationError>>>
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

    public async Task<OneOf<CreateProductResult, List<ApplicationError>>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var errors = new List<ApplicationError>();
        var product = ProductFactory.BuildNewProduct(
            id: Guid.NewGuid(),
            name: request.Name,
            price: request.Price,
            description: request.Description,
            images: []
        );
        var draftImagesUsed = new List<DraftImage>();

        foreach (var fileName in request.Images)
        {
            var draftImage = await _draftImageRepository.GetByFileNameAsync(fileName);
            if (draftImage is null)
            {
                errors.AddRange(ApplicationErrorFactory.CreateSingleListError(
                    message: $"DraftImage of fileName \"{fileName}\" does not exist.",
                    path: ["images", fileName],
                    code: ApplicationErrorCodes.ModelDoesNotExist
                ));
                continue;
            }

            if (product.TryAddDraftImage(draftImage).TryPickT1(out var domainErrors, out var _))
            {
                errors.AddRange(ApplicationErrorFactory.DomainErrorsToApplicationErrors(domainErrors));
            }
            else
            {
                draftImagesUsed.Add(draftImage);
            }
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        // Delete used Draft
        foreach (var draftImage in draftImagesUsed)
        {
            await _draftImageRepository.DeleteByFileNameAsync(draftImage.FileName);
        }

        // Create Product
        var outputProduct = await _productRepository.CreateAsync(product);

        // Create Product History
        await _productHistoryRepository.CreateAsync(ProductHistoryFactory.BuildNewProductHistoryFromProduct(outputProduct));

        return new CreateProductResult(product: outputProduct);
    }
}