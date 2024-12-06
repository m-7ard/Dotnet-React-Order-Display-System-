using Application.Contracts.Criteria;
using Application.Errors;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.List;

public class ListProductsHandler : IRequestHandler<ListProductsQuery, OneOf<ListProductsResult, List<ApplicationError>>>
{
    private readonly IProductRepository _productRepository;

    public ListProductsHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<OneOf<ListProductsResult, List<ApplicationError>>> Handle(ListProductsQuery request, CancellationToken cancellationToken)
    {
        Tuple<string, bool>? orderBy = new Tuple<string, bool>("DateCreated", false);
        if (request.OrderBy == "newest")
        {
            orderBy = new Tuple<string, bool>("DateCreated", false);
        }
        else if (request.OrderBy == "oldest")
        {
            orderBy = new Tuple<string, bool>("DateCreated", true);
        }
        else if (request.OrderBy == "price desc")
        {
            orderBy = new Tuple<string, bool>("Price", false);
        }
        else if (request.OrderBy == "price asc")
        {
            orderBy = new Tuple<string, bool>("Price", true);
        }

        var criteria = new FilterProductsCriteria(
            id: request.Id,
            name: request.Name,
            minPrice: request.MinPrice,
            maxPrice: request.MaxPrice,
            description: request.Description,
            createdBefore: request.CreatedBefore,
            createdAfter: request.CreatedAfter,
            orderBy: orderBy
        );
        var products = await _productRepository.FilterAllAsync(criteria);
        var result = new ListProductsResult(products: products);
        return result;
    }
}