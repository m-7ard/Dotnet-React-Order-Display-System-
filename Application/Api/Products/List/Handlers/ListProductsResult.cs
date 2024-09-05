using Domain.Models;

namespace Application.Api.Products.List.Handlers;

public class ListProductsResult
{
    public ListProductsResult(List<Product> products)
    {
        Products = products;
    }

    public List<Product> Products { get; set; }
}