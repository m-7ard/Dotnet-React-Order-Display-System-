using Domain.Models;

namespace Application.Api.Products.Read.Handlers;

public class ReadProductResult
{
    public ReadProductResult(Product product)
    {
        Product = product;
    }

    public Product Product { get; set; }
}