using Domain.Models;

namespace Application.Api.Products.Create.Handlers;

public class CreateProductResult
{
    public CreateProductResult(Product product)
    {
        Product = product;
    }

    public Product Product { get; set; }
}