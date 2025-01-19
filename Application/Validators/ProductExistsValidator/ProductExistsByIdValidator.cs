using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.Product;
using OneOf;

namespace Application.Validators.ProductExistsValidator;

public class ProductExistsByIdValidator : IProductExistsValidator<ProductId>
{
    private readonly IProductRepository _productRepository;

    public ProductExistsByIdValidator(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<OneOf<Product, List<ApplicationError>>> Validate(ProductId id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Product of Id \"{id}\" does not exist.",
                code: SpecificApplicationErrorCodes.PRODUCT_EXISTS_ERROR,
                path: []
            );
        }

        return product;
    }
}