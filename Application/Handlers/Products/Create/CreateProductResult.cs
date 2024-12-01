using Domain.Models;

namespace Application.Handlers.Products.Create;

public class CreateProductResult
{
    public CreateProductResult(Product product)
    {
        Product = product;
    }

    public Product Product { get; set; }
}