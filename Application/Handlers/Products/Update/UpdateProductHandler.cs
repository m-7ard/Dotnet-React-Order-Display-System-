using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Validators;
using Application.Validators.DraftImageExistsValidator;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductImage;
using Domain.ValueObjects.Shared;
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
    private readonly IDraftImageExistsValidator<FileName> _draftImageExistsValidator;

    public UpdateProductHandler(IProductRepository productRepository, IProductHistoryRepository productHistoryRepository, IDraftImageRepository draftImageRepository, IProductExistsValidator<ProductId> productExistsValidator, ILatestProductHistoryExistsValidator<ProductId> latestProductHistoryExistsValidator, IDraftImageExistsValidator<FileName> draftImageExistsValidator)
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
        var canCreateProductId = ProductId.CanCreate(request.Id);
        if (canCreateProductId.TryPickT1(out var error, out var _))
        {
            return ApplicationErrorFactory.CreateSingleListError(message: error, path: [], code: GeneralApplicationErrorCodes.OPERATION_FAILED);
        }

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

        var draftsUsed = new List<DraftImage>();
        var imageErrors = new List<ApplicationError>();
        List<ProductImage> imagesToDelete = [..product.Images];

        foreach (var fileName in request.Images)
        {
            // Is Valid FileName
            var canCreateFileName = FileName.CanCreate(fileName);
            if (canCreateFileName.TryPickT1(out error, out _))
            {
                imageErrors.Add(new ApplicationError(message: error, code: GeneralApplicationErrorCodes.NOT_ALLOWED, path: [fileName]));
                continue;
            }

            // Product Image already exists
            var productImage = product.FindProductImageByFileName(FileName.ExecuteCreate(fileName));
            if (productImage is not null)
            {
                imagesToDelete.Remove(productImage);
                continue;
            }

            // Draft image exists
            var draftImageExistsResult = await _draftImageExistsValidator.Validate(FileName.ExecuteCreate(fileName));
            if (draftImageExistsResult.TryPickT1(out errors, out var draftImage))
            {
                imageErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [fileName, ..error.Path])));
                continue;
            }

            // Can add product image
            var productImageIdGuid = Guid.NewGuid();
            var canAddProductImageResult = product.CanAddProductImage(
                id: productImageIdGuid,
                fileName: fileName,
                originalFileName: draftImage.OriginalFileName.Value,
                url: draftImage.Url
            );

            if (canAddProductImageResult.TryPickT1(out error, out var _))
            {
                imageErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [fileName, ..error.Path])));
                continue;
            }

            var productImageId = product.ExecuteAddProductImage(id: productImageIdGuid, fileName: fileName, originalFileName: draftImage.OriginalFileName.Value, url: draftImage.Url);
            draftsUsed.Add(draftImage);
        }

        if (imageErrors.Count > 0)
        {
            return imageErrors;
        }

        var canCreatePrice = Money.CanCreate(request.Price);
        if (canCreatePrice.TryPickT1(out error, out _))
        {
            return new NotAllowedError(error, []).AsList();
        }

        // Delete old image & update properties
        imagesToDelete.ForEach(image => product.ExecuteDeleteProductImage(image.Id));
        product.Description = request.Description;
        product.Name = request.Name;
        product.Price = Money.ExecuteCreate(request.Price);
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