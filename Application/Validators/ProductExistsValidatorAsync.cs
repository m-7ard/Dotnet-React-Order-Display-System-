using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.Models;
using OneOf;

namespace Application.Validators;

public class ProductExistsValidatorAsync : IValidatorAsync<Guid, Product>
{
    private readonly IProductRepository _productRepository;

    public ProductExistsValidatorAsync(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<OneOf<Product, List<ApplicationError>>> Validate(Guid input)
    {
     var product = await _productRepository.GetByIdAsync(input);

        if (product is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Product of Id \"{input}\" does not exist.",
                code: ApplicationValidatorErrorCodes.PRODUCT_EXISTS_ERROR,
                path: []
            );
        }

        return product;
    }
}