using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Product;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Update;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, OneOf<UpdateProductResult, List<ApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IDraftImageRepository _draftImageRepository;
    private readonly IProductExistsValidator<ProductId> _productExistsValidator;
    private readonly ILatestProductHistoryExistsValidator<ProductId> _latestProductHistoryExistsValidator;
    private readonly DraftImageExistsValidatorAsync _draftImageExistsValidator;

    public UpdateProductHandler(IProductRepository productRepository, IProductHistoryRepository productHistoryRepository, IDraftImageRepository draftImageRepository, IProductExistsValidator<ProductId> productExistsValidator, ILatestProductHistoryExistsValidator<ProductId> latestProductHistoryExistsValidator, DraftImageExistsValidatorAsync draftImageExistsValidator)
    {
        _productRepository = productRepository;
        _productHistoryRepository = productHistoryRepository;
        _draftImageRepository = draftImageRepository;
        _productExistsValidator = productExistsValidator;
        _latestProductHistoryExistsValidator = latestProductHistoryExistsValidator;
        _draftImageExistsValidator = draftImageExistsValidator;
    }

    public async Task<OneOf<UpdateProductResult, List<ApplicationError>>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var productId = ProductId.ExecuteCreate(request.Id);
        var productExistsResult = await _productExistsValidator.Validate(productId);
        if (productExistsResult.TryPickT1(out var errors, out var product))
        {
            return errors;
        }

        var latestProductHistoryExistsResult = await _latestProductHistoryExistsValidator.Validate(ProductId.ExecuteCreate(request.Id));
        if (latestProductHistoryExistsResult.TryPickT1(out errors, out var productHistory))
        {
            return errors;
        }

        var newProductImagesValue = new List<ProductImage>();
        var draftsUsed = new List<DraftImage>();
        var imageErrors = new List<ApplicationError>();

        foreach (var fileName in request.Images)
        {
            // Product Image already exists
            var productImage = product.Images.Find(image => image.FileName == fileName);
            if (productImage is not null)
            {
                newProductImagesValue.Add(productImage);
                continue;
            }

            // Draft image exists
            var draftImageExistsResult = await _draftImageExistsValidator.Validate(fileName);
            if (draftImageExistsResult.TryPickT1(out errors, out var draftImage))
            {
                imageErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [fileName, ..error.Path])));
                continue;
            }

            // Can add product imagee / valid data validation
            var canAddProductImageValidator = new CanAddProductImageValidator(product);
            var canAddProductImageResult = canAddProductImageValidator.Validate(new CanAddProductImageValidator.Input(
                fileName: draftImage.FileName,
                originalFileName: draftImage.OriginalFileName,
                url: draftImage.Url
            ));
            if (canAddProductImageResult.TryPickT1(out errors, out var _))
            {
                imageErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [fileName, ..error.Path])));
                continue;
            }

            // Create product image (does not add it to the Product domain object yet)
            var newImage = product.CreateProductImage(fileName: draftImage.FileName, originalFileName: draftImage.OriginalFileName, url: draftImage.Url);
            newProductImagesValue.Add(newImage);
            draftsUsed.Add(draftImage);
        }

        if (imageErrors.Count > 0)
        {
            return imageErrors;
        }

        product.UpdateImages(newProductImagesValue);
        product.Description = request.Description;
        product.Name = request.Name;
        product.Price = request.Price;
        await _productRepository.UpdateAsync(product);

        // Delete used drafts
        foreach (var draftImage in draftsUsed)
        {
            await _draftImageRepository.DeleteByFileNameAsync(draftImage.FileName);
        }

        // Invalidate old history
        productHistory.Invalidate();
        await _productHistoryRepository.UpdateAsync(productHistory);

        // Create new Product History
        var newProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(product: product);
        await _productHistoryRepository.CreateAsync(newProductHistory);

        return new UpdateProductResult(id: product.Id);
    }
}