using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators.ProductExistsValidator;
using Domain.Models;
using Domain.ValueObjects.ProductHistory;
using OneOf;

namespace Application.Validators.ProductHistoryExistsValidator;

public class ProductHistoryExistsByIdValidator : IProductHistoryExistsValidator<ProductHistoryId>
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ProductHistoryExistsByIdValidator(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<ProductHistory, List<ApplicationError>>> Validate(ProductHistoryId id)
    {
        var productHistory = await _productHistoryRepository.GetByIdAsync(id);

        if (productHistory is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Product of Id \"{id}\" does not exist.",
                code: ApplicationValidatorErrorCodes.PRODUCT_EXISTS_ERROR,
                path: []
            );
        }

        return productHistory;
    }
}