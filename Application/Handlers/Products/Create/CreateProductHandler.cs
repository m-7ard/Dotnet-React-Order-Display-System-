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

        var draftImages = new List<DraftImage>();
        foreach (var fileName in request.Images)
        {
            var draftImage = await _draftImageRepository.GetByFileNameAsync(fileName);
            if (draftImage is null)
            {
                errors.Add(new ApplicationError(
                    message: $"DraftImage of fileName \"{fileName}\" does not exist.",
                    path: ["images", fileName],
                    code: ApplicationErrorCodes.ModelDoesNotExist
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