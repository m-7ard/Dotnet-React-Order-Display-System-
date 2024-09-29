using Application.ErrorHandling.Application;
using Application.ErrorHandling.Other;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using MediatR;
using OneOf;

namespace Application.Api.Products.Update.Handlers;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, OneOf<UpdateProductResult, List<PlainApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IDraftImageRepository _draftImageRepository;

    public UpdateProductHandler(IProductRepository productRespository, IProductHistoryRepository productHistoryRepository, IDraftImageRepository draftImageRepository)
    {
        _productRepository = productRespository;
        _productHistoryRepository = productHistoryRepository;
        _draftImageRepository = draftImageRepository;
    }

    public async Task<OneOf<UpdateProductResult, List<PlainApplicationError>>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var errors = new List<PlainApplicationError>();

        var productUpdating = await _productRepository.GetByIdAsync(request.Id);
        if (productUpdating is null)
        {
            errors.Add(new PlainApplicationError(
                message: $"Product of Id \"{request.Id}\" does not exist.",
                path: ["_"],
                code: ValidationErrorCodes.ModelDoesNotExist
            ));

            return errors;
        }

        var latestProductHistory = await _productHistoryRepository.GetLatestByProductIdAsync(productUpdating.Id);
        if (latestProductHistory is null)
        {
            errors.Add(new PlainApplicationError(
                message: $"Product of Id \"{request.Id}\" lacks valid ProductHistory.",
                path: ["_"],
                code: ValidationErrorCodes.IntegrityError
            ));

            return errors;
        }

        var newProductImageValue = new List<ProductImage>();
        var draftsUsed = new List<DraftImage>();

        foreach (var fileName in request.Images)
        {
            var productImage = productUpdating.Images.Find(image => image.FileName == fileName);
            if (productImage is not null)
            {
                newProductImageValue.Add(productImage);
                continue;
            }

            var draftImage = await _draftImageRepository.GetByFileNameAsync(fileName);
            if (draftImage is null)
            {
                errors.Add(new PlainApplicationError(
                    message: $"ProductImage of fileName \"{fileName}\" does not exist.",
                    path: ["images", fileName],
                    code: ValidationErrorCodes.ModelDoesNotExist
                ));
                continue;
            }

            newProductImageValue.Add(ProductImageFactory.BuildNewProductImageFromDraftImage(draftImage));
            draftsUsed.Add(draftImage);
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        productUpdating.Name = request.Name;
        productUpdating.Price = request.Price;
        productUpdating.Description = request.Description;
        productUpdating.Images = newProductImageValue;
        await _productRepository.UpdateAsync(productUpdating);

        foreach (var draftImage in draftsUsed)
        {
            await _draftImageRepository.DeleteByFileNameAsync(draftImage.FileName);
        }

        // Invalidate old history
        latestProductHistory.Invalidate();
        await _productHistoryRepository.UpdateAsync(latestProductHistory);

        // Create new Product History
        var inputProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(productUpdating);
        var productHistory = await _productHistoryRepository.CreateAsync(inputProductHistory);

        return new UpdateProductResult
        (
            product: productUpdating
        );
    }
}