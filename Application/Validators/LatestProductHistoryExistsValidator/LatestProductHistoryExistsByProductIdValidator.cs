using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.Product;
using OneOf;

namespace Application.Validators.LatestProductHistoryExistsValidator;

public class LatestProductHistoryExistsByProductIdValidator : ILatestProductHistoryExistsValidator<ProductId>
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public LatestProductHistoryExistsByProductIdValidator(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<ProductHistory, List<ApplicationError>>> Validate(ProductId input)
    {
        var productHistory = await _productHistoryRepository.GetLatestByProductIdAsync(input);

        if (productHistory is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Latest Product History for Product of Id \"{input}\" does not exist.",
                code: SpecificApplicationErrorCodes.LATEST_PRODUCT_HISTORY_EXISTS_ERROR,
                path: []
            );
        }

        return productHistory;
    }
}