using Application.ErrorHandling.Application;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Api.ProductHistories.List.Handlers;

public class ListProductHistoriesHandler : IRequestHandler<ListProductHistoriesQuery, OneOf<ListProductHistoriesResult, List<PlainApplicationError>>>
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ListProductHistoriesHandler(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<ListProductHistoriesResult, List<PlainApplicationError>>> Handle(ListProductHistoriesQuery request, CancellationToken cancellationToken)
    {
        var productHistories = await _productHistoryRepository.FindAllAsync(
            name: request.Name,
            minPrice: request.MinPrice,
            maxPrice: request.MaxPrice,
            description: request.Description,
            validFrom: request.ValidFrom,
            validTo: request.ValidTo,
            productId: request.ProductId
        );

        var result = new ListProductHistoriesResult(productHistories: productHistories);
        return result;
    }
}