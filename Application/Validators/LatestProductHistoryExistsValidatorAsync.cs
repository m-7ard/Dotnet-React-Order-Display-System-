using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.Models;
using OneOf;

namespace Application.Validators;

public class LatestProductHistoryExistsValidatorAsync : IValidatorAsync<Guid, ProductHistory>
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public LatestProductHistoryExistsValidatorAsync(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<ProductHistory, List<ApplicationError>>> Validate(Guid input)
    {
        var productHistory = await _productHistoryRepository.GetLatestByProductIdAsync(input);
        if (productHistory is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Latest Product History for Product of Id \"{input}\" does not exist.",
                code: ApplicationValidatorErrorCodes.LATEST_PRODUCT_HISTORY_EXISTS_ERROR,
                path: []
            );
        }

        return productHistory;
    }
}