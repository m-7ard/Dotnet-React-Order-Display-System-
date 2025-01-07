using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
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
    private readonly DraftImageExistsValidatorAsync _draftImageExistsValidator;

    public CreateProductHandler(IProductRepository productRepository, IDraftImageRepository draftImageRepository, IProductHistoryRepository productHistoryRepository)
    {
        _productRepository = productRepository;
        _draftImageRepository = draftImageRepository;
        _productHistoryRepository = productHistoryRepository;
        _draftImageExistsValidator = new DraftImageExistsValidatorAsync(draftImageRepository);
    }

    public async Task<OneOf<CreateProductResult, List<ApplicationError>>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = ProductFactory.BuildNewProduct(
            id: Guid.NewGuid(),
            name: request.Name,
            price: request.Price,
            description: request.Description,
            images: []
        );
        var draftImagesUsed = new List<DraftImage>();
        var imageErrors = new List<ApplicationError>();

        foreach (var fileName in request.Images)
        {
            var draftImageExistsResult = await _draftImageExistsValidator.Validate(fileName);
            if (draftImageExistsResult.TryPickT1(out var errors, out var draftImage))
            {
                imageErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [fileName, ..error.Path])));
                continue;
            }

            var canAddProductImageValidator = new CanAddProductImageValidator(product);
            var canAddProductImageResult = canAddProductImageValidator.Validate(new CanAddProductImageValidator.Input(fileName: draftImage.FileName, originalFileName: draftImage.OriginalFileName, url: draftImage.Url ));
            if (canAddProductImageResult.TryPickT1(out errors, out var _))
            {
                imageErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [fileName, ..error.Path])));
                continue;
            }

            product.ExecuteAddProductImage(fileName: draftImage.FileName, originalFileName: draftImage.OriginalFileName, url: draftImage.Url);
            draftImagesUsed.Add(draftImage);
        }

        if (imageErrors.Count > 0)
        {
            return imageErrors;
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

        return new CreateProductResult(id: product.Id);
    }
}