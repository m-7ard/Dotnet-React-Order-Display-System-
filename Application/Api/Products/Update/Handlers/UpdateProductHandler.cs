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
    private readonly IProductImageRepository _productImageRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;

    public UpdateProductHandler(IProductRepository productRespository, IProductImageRepository productImageRespository, IProductHistoryRepository productHistoryRepository)
    {
        _productRepository = productRespository;
        _productImageRepository = productImageRespository;
        _productHistoryRepository = productHistoryRepository;
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

        var newProductImageValue = new List<ProductImage>();
        foreach (var fileName in request.Images)
        {
            var productImage = await _productImageRepository.GetByFileNameAsync(fileName);
            if (productImage is null)
            {
                errors.Add(new PlainApplicationError(
                    message: $"ProductImage of fileName \"{fileName}\" does not exist.",
                    path: ["images", fileName],
                    code: ValidationErrorCodes.ModelDoesNotExist
                ));
                continue;
            }

            if (productImage.ProductId is not null && productImage.ProductId != request.Id)
            {
                errors.Add(new PlainApplicationError(
                    message: $"ProductImage of fileName \"{fileName}\" has already been assigned to another Product.",
                    path: ["images", fileName],
                    code: ValidationErrorCodes.StateMismatch
                ));
                continue;
            }

            newProductImageValue.Add(productImage);
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

        // Delete unused Image models
        var oldProductImageValue = await _productImageRepository.FilterByProductIdAsync(productId: productUpdating.Id);
        foreach (var oldImage in oldProductImageValue)
        {
            if (newProductImageValue.Find(d => d.FileName == oldImage.FileName) is null)
            {
                await _productImageRepository.DeleteByFileNameAsync(oldImage.FileName);
            }
        }

        // Assign new Image models
        foreach (var newOrExistingImage in newProductImageValue)
        {
            if (newOrExistingImage.ProductId is not null) 
            {
                continue;
            }

            await _productImageRepository.AssignToProductAsync(productId: productUpdating.Id, productImageId: newOrExistingImage.Id);
        }
        
        // Create new Product History
        var inputProductHistory = ProductHistoryFactory.BuildNewProductHistory(
            name: productUpdating.Name,
            images: productUpdating.Images.Select(image => image.FileName).ToList(),
            price: productUpdating.Price,
            productId: productUpdating.Id,
            description: productUpdating.Description
        );
        var productHistory = await _productHistoryRepository.CreateAsync(inputProductHistory);

        return new UpdateProductResult
        (
            product: productUpdating
        );
    }
}