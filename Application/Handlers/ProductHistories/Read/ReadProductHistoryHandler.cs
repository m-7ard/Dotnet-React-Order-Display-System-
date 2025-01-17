using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using Application.Validators.ProductExistsValidator;
using Domain.ValueObjects.ProductHistory;
using MediatR;
using OneOf;

namespace Application.Handlers.ProductHistories.Read;

public class ReadProductHistoryHandler : IRequestHandler<ReadProductHistoryQuery, OneOf<ReadProductHistoryResult, List<ApplicationError>>>
{
    private readonly IProductHistoryExistsValidator<ProductHistoryId> _productHistoryExistsValidator;

    public ReadProductHistoryHandler(IProductHistoryExistsValidator<ProductHistoryId> productHistoryExistsValidator)
    {
        _productHistoryExistsValidator = productHistoryExistsValidator;
    }

    public async Task<OneOf<ReadProductHistoryResult, List<ApplicationError>>> Handle(ReadProductHistoryQuery request, CancellationToken cancellationToken)
    {
        var productHistoryExistsResult = await _productHistoryExistsValidator.Validate(ProductHistoryId.ExecuteCreate(request.Id));
        if (productHistoryExistsResult.TryPickT1(out var errors, out var productHistory))
        {
            return errors;
        }

        var result = new ReadProductHistoryResult(productHistory: productHistory);
        return result;
    }
}