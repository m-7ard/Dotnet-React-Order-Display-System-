using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.ValueObjects.Product;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Delete;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, OneOf<DeleteProductResult, List<ApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IProductExistsValidator<ProductId> _productExistsValidator;
    private readonly ILatestProductHistoryExistsValidator<ProductId> _latestProductHistoryExistsValidator;

    public DeleteProductHandler(IProductRepository productRepository, IProductHistoryRepository productHistoryRepository, IProductExistsValidator<ProductId> productExistsValidator, ILatestProductHistoryExistsValidator<ProductId> latestProductHistoryExistsValidator)
    {
        _productRepository = productRepository;
        _productHistoryRepository = productHistoryRepository;
        _productExistsValidator = productExistsValidator;
        _latestProductHistoryExistsValidator = latestProductHistoryExistsValidator;
    }

    public async Task<OneOf<DeleteProductResult, List<ApplicationError>>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
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

        // Invalidate old history
        productHistory.Invalidate();
        await _productHistoryRepository.UpdateAsync(productHistory);

        // Delete product
        await _productRepository.DeleteByIdAsync(product.Id);

        var result = new DeleteProductResult();
        return result;
    }
}