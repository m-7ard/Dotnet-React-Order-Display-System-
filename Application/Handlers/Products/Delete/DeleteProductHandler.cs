using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Delete;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, OneOf<DeleteProductResult, List<ApplicationError>>>
{
    private readonly IProductDomainService _productDomainService;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProductHandler(IProductDomainService productDomainService, IUnitOfWork unitOfWork)
    {
        _productDomainService = productDomainService;
        _unitOfWork = unitOfWork;
    }

    public async Task<OneOf<DeleteProductResult, List<ApplicationError>>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var productExists = await _productDomainService.GetProductById(request.Id);
        if (productExists.IsT1) return new ProductDoesNotExistError(message: productExists.AsT1, path: []).AsList();

        var product = productExists.AsT0;

        var canDelete = await _productDomainService.TryOrchestrateDeleteProduct(product);
        if (canDelete.IsT1) return new CannotDeleteProductError(message: canDelete.AsT1, path: []).AsList();

        await _unitOfWork.SaveAsync();
        return new DeleteProductResult();
    }
}