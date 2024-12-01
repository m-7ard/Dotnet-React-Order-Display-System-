using Domain.Models;

namespace Application.Handlers.Products.Update;

public class UpdateProductResult
{
    public UpdateProductResult(Product product)
    {
        Product = product;
    }

    public Product Product { get; set; }
}