using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Validators.DraftImageExistsValidator;
using Domain.Contracts.Products;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Shared;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Create;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, OneOf<CreateProductResult, List<ApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IDraftImageRepository _draftImageRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IDraftImageExistsValidator<FileName> _draftImageExistsValidator;

    public CreateProductHandler(IProductRepository productRepository, IDraftImageRepository draftImageRepository, IProductHistoryRepository productHistoryRepository, IDraftImageExistsValidator<FileName> draftImageExistsValidator)
    {
        _productRepository = productRepository;
        _draftImageRepository = draftImageRepository;
        _productHistoryRepository = productHistoryRepository;
        _draftImageExistsValidator = draftImageExistsValidator;
    }

    public async Task<OneOf<CreateProductResult, List<ApplicationError>>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var contract = new CreateProductContract(
            id: Guid.NewGuid(),
            name: request.Name,
            price: request.Price,
            description: request.Description,
            dateCreated: DateTime.UtcNow,
            amount: request.Amount,
            images: []
        );

        var canCreateProduct = Product.CanCreate(contract);
        if (canCreateProduct.TryPickT1(out var error, out _))
        {
            return new NotAllowedError(error, []).AsList();
        }

        var product = Product.ExecuteCreate(contract);

        var draftImagesUsed = new List<DraftImage>();
        var imageErrors = new List<ApplicationError>();

        foreach (var fileName in request.Images)
        {
            // Is valid filename
            var canCreateFileName = FileName.CanCreate(fileName);
            if (canCreateFileName.TryPickT1(out error, out var _))
            {
                return new OperationFailedError(error, []).AsList();
            }

            var draftImageFileName = FileName.ExecuteCreate(fileName);
            
            // Draft image exists
            var draftImageExistsResult = await _draftImageExistsValidator.Validate(draftImageFileName);
            if (draftImageExistsResult.TryPickT1(out var errors, out var draftImage))
            {
                imageErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [fileName, ..error.Path])));
                continue;
            }

            var productImageIdGuid = Guid.NewGuid();
            var canAddProductImageResult = product.CanAddProductImage(id: productImageIdGuid, fileName: draftImage.FileName.Value, originalFileName: draftImage.OriginalFileName.Value, url: draftImage.Url);
            if (canAddProductImageResult.TryPickT1(out error, out var _))
            {
                imageErrors.AddRange(ApplicationErrorFactory.CreateSingleListError(
                    message: error,
                    path: [fileName],
                    code: SpecificApplicationErrorCodes.CAN_ADD_PRODUCT_IMAGE
                ));
                continue;
            }

            product.ExecuteAddProductImage(id: productImageIdGuid, fileName: draftImage.FileName.Value, originalFileName: draftImage.OriginalFileName.Value, url: draftImage.Url);
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