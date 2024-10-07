using Application.ErrorHandling.Application;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Api.Products.List.Handlers;

public class ListProductsHandler : IRequestHandler<ListProductsQuery, OneOf<ListProductsResult, List<PlainApplicationError>>>
{
    private readonly IProductRepository _productRepository;

    public ListProductsHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<OneOf<ListProductsResult, List<PlainApplicationError>>> Handle(ListProductsQuery request, CancellationToken cancellationToken)
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

        var products = await _productRepository.FindAllAsync(
            id: request.Id,
            name: request.Name,
            minPrice: request.MinPrice,
            maxPrice: request.MaxPrice,
            description: request.Description,
            createdBefore: request.CreatedBefore,
            createdAfter: request.CreatedAfter,
            orderBy: orderBy
        );

        var result = new ListProductsResult(products: products);
        return result;
    }
}