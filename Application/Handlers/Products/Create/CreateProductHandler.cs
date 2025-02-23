using Application.Contracts.DomainService.ProductDomainService;
using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.DomainFactories;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Create;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, OneOf<CreateProductResult, List<ApplicationError>>>
{
    private readonly IProductDomainService _productDomainService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateProductHandler(IProductDomainService productDomainService, IUnitOfWork unitOfWork)
    {
        _productDomainService = productDomainService;
        _unitOfWork = unitOfWork;
    }

    public async Task<OneOf<CreateProductResult, List<ApplicationError>>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var contract = new OrchestrateCreateNewProductContract(
            id: Guid.NewGuid(),
            name: request.Name,
            price: request.Price,
            description: request.Description,
            amount: request.Amount
        );

        var tryOrchestrateCreateProduct = _productDomainService.TryOrchestrateCreateProduct(contract);

        if (tryOrchestrateCreateProduct.IsT1)
        {
            return new CannotCreateProductError(message: tryOrchestrateCreateProduct.AsT1, path: []).AsList();
        }

        var product = tryOrchestrateCreateProduct.AsT0;
        
        var imageErrors = new List<ApplicationError>();

        foreach (var fileName in request.Images)
        {
            var tryOrchestrateAddNewProductImage = await _productDomainService.TryOrchestrateAddNewProductImage(product: product, fileName: fileName);
            if (tryOrchestrateAddNewProductImage.IsT1)
            {
                imageErrors.Add(new CannotAddProductImageError(message: tryOrchestrateAddNewProductImage.AsT1, path: [fileName]));
            }
        }

        if (imageErrors.Count > 0)
        {
            return imageErrors;
        }

        await _unitOfWork.ProductRepository.LazyCreateAsync(product);
        await _unitOfWork.ProductHistoryRepository.LazyCreateAsync(ProductHistoryFactory.BuildNewProductHistoryFromProduct(product));
        await _unitOfWork.SaveAsync();

        return new CreateProductResult(id: product.Id);
    }
}