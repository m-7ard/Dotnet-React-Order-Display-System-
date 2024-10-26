using Application.ErrorHandling.Application;
using Application.ErrorHandling.Other;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Api.Products.Delete.Handlers;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, OneOf<DeleteProductResult, List<PlainApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;

    public DeleteProductHandler(IProductRepository productRepository, IProductHistoryRepository productHistoryRepository)
    {
        _productRepository = productRepository;
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<DeleteProductResult, List<PlainApplicationError>>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(id: request.Id);
        if (product is null)
        {
            return new List<PlainApplicationError>() {
                new PlainApplicationError(
                    message: $"Product with Id \"{request.Id}\" does not exist.",
                    path: ["_"],
                    code: ValidationErrorCodes.ModelDoesNotExist
                )
            };
        }

        var latestProductHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);
        if (latestProductHistory is null)
        {
            return new List<PlainApplicationError>() {
                new PlainApplicationError(
                    message: $"Product of Id \"{request.Id}\" lacks valid ProductHistory.",
                    path: ["_"],
                    code: ValidationErrorCodes.IntegrityError
                )
            };
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