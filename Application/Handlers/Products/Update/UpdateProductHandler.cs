using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Update;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, OneOf<UpdateProductResult, List<ApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IDraftImageRepository _draftImageRepository;

    public UpdateProductHandler(IProductRepository productRepository, IProductHistoryRepository productHistoryRepository, IDraftImageRepository draftImageRepository)
    {
        _productRepository = productRepository;
        _productHistoryRepository = productHistoryRepository;
        _draftImageRepository = draftImageRepository;
    }

    public async Task<OneOf<UpdateProductResult, List<ApplicationError>>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var errors = new List<ApplicationError>();

        var product = await _productRepository.GetByIdAsync(request.Id);
        if (product is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Product of Id \"{request.Id}\" does not exist.",
                path: ["_"],
                code: ApplicationErrorCodes.ModelDoesNotExist
            );
        }

        var latestProductHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);
        if (latestProductHistory is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Product of Id \"{request.Id}\" does not exist.",
                path: ["_"],
                code: ApplicationErrorCodes.IntegrityError
            );
        }

        var newProductImagesValue = new List<ProductImage>();
        var draftsUsed = new List<DraftImage>();

        foreach (var fileName in request.Images)
        {
            var productImage = product.Images.Find(image => image.FileName == fileName);
            if (productImage is not null)
            {
                newProductImagesValue.Add(productImage);
                continue;
            }

            var draftImage = await _draftImageRepository.GetByFileNameAsync(fileName);
            if (draftImage is null)
            {
                errors.Add(new ApplicationError(
                    message: $"ProductImage of fileName \"{fileName}\" does not exist.",
                    path: ["images", fileName],
                    code: ApplicationErrorCodes.ModelDoesNotExist
                ));
                continue;
            }

            var newImage = product.CreateProductImageFromDraft(draftImage);
            newProductImagesValue.Add(newImage);
            draftsUsed.Add(draftImage);
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        var updateResult = product.TryUpdate(
            name: request.Name,
            price: request.Price,
            description: request.Description,
            images: newProductImagesValue
        );
        if (updateResult.TryPickT1(out var updateErrors, out var _))
        {
            return ApplicationErrorFactory.DomainErrorsToApplicationErrors(updateErrors);
        }

        await _productRepository.UpdateAsync(product);

        // Delete used drafts
        foreach (var draftImage in draftsUsed)
        {
            await _draftImageRepository.DeleteByFileNameAsync(draftImage.FileName);
        }

        // Invalidate old history
        latestProductHistory.Invalidate();
        await _productHistoryRepository.UpdateAsync(latestProductHistory);

        // Create new Product History
        var inputProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(product: product);
        await _productHistoryRepository.CreateAsync(inputProductHistory);

        return new UpdateProductResult(id: product.Id);
    }
}