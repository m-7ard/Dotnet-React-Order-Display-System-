using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Delete;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, OneOf<DeleteProductResult, List<ApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly ProductExistsValidatorAsync _productExistsValidator;
    private readonly LatestProductHistoryExistsValidatorAsync _latestProductHistoryExistsValidator;

    public DeleteProductHandler(IProductRepository productRepository, IProductHistoryRepository productHistoryRepository)
    {
        _productRepository = productRepository;
        _productHistoryRepository = productHistoryRepository;
        _productExistsValidator = new ProductExistsValidatorAsync(productRepository);
        _latestProductHistoryExistsValidator = new LatestProductHistoryExistsValidatorAsync(productHistoryRepository);
    }

    public async Task<OneOf<DeleteProductResult, List<ApplicationError>>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var productExistsResult = await _productExistsValidator.Validate(request.Id);
        if (productExistsResult.TryPickT1(out var errors, out var product))
        {
            return errors;
        }

        var latestProductHistoryExistsResult = await _latestProductHistoryExistsValidator.Validate(request.Id);
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