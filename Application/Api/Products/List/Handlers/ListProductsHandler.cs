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
        var products = await _productRepository.FindAllAsync(
            name: request.Name,
            minPrice: request.MinPrice,
            maxPrice: request.MaxPrice,
            description: request.Description,
            createdBefore: request.CreatedBefore,
            createdAfter: request.CreatedAfter
        );

        var result = new ListProductsResult(products: products);
        return result;
    }
}