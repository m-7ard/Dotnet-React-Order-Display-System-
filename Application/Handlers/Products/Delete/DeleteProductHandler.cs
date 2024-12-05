using Application.Errors;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Delete;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, OneOf<DeleteProductResult, List<ApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;

    public DeleteProductHandler(IProductRepository productRepository, IProductHistoryRepository productHistoryRepository)
    {
        _productRepository = productRepository;
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<DeleteProductResult, List<ApplicationError>>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(id: request.Id);
        if (product is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Product with Id \"{request.Id}\" does not exist.",
                path: ["_"],
                code: ApplicationErrorCodes.ModelDoesNotExist
            );
        }

        var latestProductHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);
        if (latestProductHistory is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Product of Id \"{request.Id}\" lacks valid ProductHistory.",
                path: ["_"],
                code: ApplicationErrorCodes.IntegrityError
            );
        }

        // Invalidate old history
        latestProductHistory.Invalidate();
        await _productHistoryRepository.UpdateAsync(latestProductHistory);

        // Delete product
        await _productRepository.DeleteByIdAsync(product.Id);

        var result = new DeleteProductResult();
        return result;
    }
}