using Application.Contracts.DomainService.ProductDomainService;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Contracts.Products;
using Domain.Models;
using Domain.ValueObjects.Product;
using OneOf;

namespace Application.DomainService;

public class ProductDomainService : IProductDomainService
{
    private readonly IDraftImageDomainService _draftImageDomainService;
    private readonly IUnitOfWork _unitOfWork;

    public ProductDomainService(IDraftImageDomainService draftImageDomainService, IUnitOfWork unitOfWork)
    {
        _draftImageDomainService = draftImageDomainService;
        _unitOfWork = unitOfWork;
    }

    public async Task<OneOf<Product, string>> GetProductById(Guid id)
    {
        var canCreateProductId = ProductId.TryCreate(id);
        if (canCreateProductId.IsT1) return canCreateProductId.AsT1;
        
        var productId = canCreateProductId.AsT0;

        var product = await _unitOfWork.ProductRepository.GetByIdAsync(productId);
        if (product is null) return $"Product of Id \"{productId}\" does not exist.";

        return product;
    }

    public OneOf<Product, string> TryOrchestrateCreateProduct(OrchestrateCreateNewProductContract contract)
    {
        var createProductcontract = new CreateProductContract(
            id: contract.Id,
            name: contract.Name,
            price: contract.Price,
            description: contract.Description,
            dateCreated: DateTime.UtcNow,
            amount: contract.Amount,
            images: []
        );

        var canCreateProduct = Product.CanCreate(createProductcontract);
        if (canCreateProduct.TryPickT1(out var error, out _)) return error;

        var product = Product.ExecuteCreate(createProductcontract);
        return product;
    }

    public async Task<OneOf<bool, string>> TryOrchestrateAddNewProductImage(Product product, string fileName)
    {
        var draftImageExistsResult = await _draftImageDomainService.GetDraftImageByFileName(fileName);
        if (draftImageExistsResult.IsT1)
        {
            return draftImageExistsResult.AsT1;
        }

        var draftImage = draftImageExistsResult.AsT0;

        var productImageIdGuid = Guid.NewGuid();
        var canAddProductImageResult = product.CanAddProductImage(id: productImageIdGuid, fileName: draftImage.FileName.Value, originalFileName: draftImage.OriginalFileName.Value, url: draftImage.Url);
        if (canAddProductImageResult.IsT1)
        {
            return canAddProductImageResult.AsT1;
        }

        product.ExecuteAddProductImage(id: productImageIdGuid, fileName: draftImage.FileName.Value, originalFileName: draftImage.OriginalFileName.Value, url: draftImage.Url);
        await _unitOfWork.DraftImageRepository.LazyDeleteByFileNameAsync(draftImage.FileName);
        return true;
    }
}