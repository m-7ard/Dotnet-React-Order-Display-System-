using Application.Contracts.DomainService.ProductDomainService;
using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Update;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, OneOf<UpdateProductResult, List<ApplicationError>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IProductDomainService _productDomainService;

    public UpdateProductHandler(IUnitOfWork unitOfWork, IProductDomainService productDomainService)
    {
        _unitOfWork = unitOfWork;
        _productDomainService = productDomainService;
    }

    public async Task<OneOf<UpdateProductResult, List<ApplicationError>>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var productExists = await _productDomainService.GetProductById(request.Id);
        if (productExists.IsT1)
        {
            return new ProductDoesNotExistError(message: productExists.AsT1, path: []).AsList();
        }

        var product = productExists.AsT0;

        var contract = new OrchestrateUpdateProductContract(
            id: request.Id,
            name: request.Name,
            price: request.Price,
            description: request.Description
        );

        var tryOrchestrateUpdatePRoduct = await _productDomainService.TryOrchestrateUpdateProduct(product, contract);
        if (tryOrchestrateUpdatePRoduct.IsT1) return new CannotUpdateProductError(message: tryOrchestrateUpdatePRoduct.AsT1, path: []).AsList();

        var tryOrchestrateUpdateImages = await _productDomainService.TryOrchestrateUpdateImages(product: product, fileNames: request.Images);
        if (tryOrchestrateUpdateImages.IsT1)
        {
            return tryOrchestrateUpdateImages.AsT1
                .Select(message => new CannotUpdateProductImagesError(message: message, path: []))
                .Cast<ApplicationError>()
                .ToList();
        }

        await _unitOfWork.SaveAsync();

        return new UpdateProductResult();
    }
}