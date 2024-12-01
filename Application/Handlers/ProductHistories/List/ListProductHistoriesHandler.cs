using Application.ErrorHandling.Application;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Handlers.ProductHistories.List;

public class ListProductHistoriesHandler : IRequestHandler<ListProductHistoriesQuery, OneOf<ListProductHistoriesResult, List<PlainApplicationError>>>
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ListProductHistoriesHandler(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<ListProductHistoriesResult, List<PlainApplicationError>>> Handle(ListProductHistoriesQuery request, CancellationToken cancellationToken)
    {
        Tuple<string, bool>? orderBy = new Tuple<string, bool>("DateCreated", false);
        if (request.OrderBy == "newest")
        {
            orderBy = new Tuple<string, bool>("ValidFrom", false);
        }
        else if (request.OrderBy == "oldest")
        {
            orderBy = new Tuple<string, bool>("ValidFrom", true);
        }
        else if (request.OrderBy == "price desc")
        {
            orderBy = new Tuple<string, bool>("Price", false);
        }
        else if (request.OrderBy == "price asc")
        {
            orderBy = new Tuple<string, bool>("Price", true);
        }
        else if (request.OrderBy == "product id desc")
        {
            orderBy = new Tuple<string, bool>("OriginalProductId", false);
        }
        else if (request.OrderBy == "product id asc")
        {
            orderBy = new Tuple<string, bool>("OriginalProductId", true);
        }

        var productHistories = await _productHistoryRepository.FindAllAsync(
            name: request.Name,
            minPrice: request.MinPrice,
            maxPrice: request.MaxPrice,
            description: request.Description,
            validFrom: request.ValidFrom,
            validTo: request.ValidTo,
            productId: request.ProductId,
            orderBy: orderBy
        );

        var result = new ListProductHistoriesResult(productHistories: productHistories);
        return result;
    }
}