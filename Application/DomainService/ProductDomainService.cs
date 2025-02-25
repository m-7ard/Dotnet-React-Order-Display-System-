using Application.Contracts.DomainService.ProductDomainService;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Contracts.Products;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.Shared;
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

    public async Task<OneOf<Product, string>> TryOrchestrateCreateProduct(OrchestrateCreateNewProductContract contract)
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
        await _unitOfWork.ProductRepository.LazyCreateAsync(product);

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
        
        await _unitOfWork.ProductRepository.LazyUpdateAsync(product);
        await _unitOfWork.DraftImageRepository.LazyDeleteByFileNameAsync(draftImage.FileName);
        return true;
    }

    public async Task<OneOf<bool, List<string>>> TryOrchestrateUpdateImages(Product product, List<string> fileNames)
    {
        List<ProductImage> imagesToDelete = [..product.Images];
        var errors = new List<string>();

        foreach (var fileName in fileNames)
        {
            // Is Valid FileName
            var canCreateFileName = FileName.CanCreate(fileName);
            if (canCreateFileName.IsT1)
            {
                errors.Add(canCreateFileName.AsT1);
                continue;
            }

            var fileNameObj = FileName.ExecuteCreate(fileName);

            // Product Image already exists
            var productImage = product.FindProductImageByFileName(fileNameObj);
            if (productImage is not null)
            {
                imagesToDelete.Remove(productImage);
                continue;
            }

            var tryOrchestrateAddNewProductImage = await TryOrchestrateAddNewProductImage(product, fileName);
            if (tryOrchestrateAddNewProductImage.IsT1)
            {
                errors.Add(tryOrchestrateAddNewProductImage.AsT1);
            }
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        foreach (var productImage in imagesToDelete)
        {
            product.ExecuteDeleteProductImage(productImage.Id);
        }

        await _unitOfWork.ProductRepository.LazyUpdateAsync(product);
        return true;
    }

    public async Task<OneOf<bool, string>> TryOrchestrateUpdateProduct(Product product, OrchestrateUpdateProductContract contract)
    {
        var updateProductContract = new UpdateProductContract(
            id: product.Id.Value,
            name: contract.Name,
            price: contract.Price,
            description: contract.Description,
            amount: product.Amount.Value
        );

        var canUpdate = product.CanUpdate(updateProductContract);
        if (canUpdate.IsT1)
        {
            return canUpdate.AsT1;
        }

        product.ExecuteUpdate(updateProductContract);
        await _unitOfWork.ProductRepository.LazyUpdateAsync(product);

        return true;
    }

    public async Task<OneOf<bool, string>> TryOrchestrateDeleteProduct(Product product)
    {
        // Delete product
        await _unitOfWork.ProductRepository.LazyDeleteByIdAsync(product.Id);
    
        return true;
    }
}