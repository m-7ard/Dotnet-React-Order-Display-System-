using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.Models;
using OneOf;

namespace Application.Validators;

public class ProductHistoryExistsValidatorAsync : IValidatorAsync<Guid, ProductHistory>
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ProductHistoryExistsValidatorAsync(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<ProductHistory, List<ApplicationError>>> Validate(Guid input)
    {
        var productHistory = await _productHistoryRepository.GetByIdAsync(input);

        if (productHistory is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Product History of Id \"{input}\" does not exist.",
                code: ApplicationValidatorErrorCodes.PRODUCT_HISTORY_EXISTS_ERROR,
                path: []
            );
        }

        return productHistory;
    }
}