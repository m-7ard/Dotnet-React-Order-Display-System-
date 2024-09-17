using Domain.Models;

namespace Application.Api.Products.Update.Handlers;

public class UpdateProductResult
{
    public UpdateProductResult(Product product)
    {
        Product = product;
    }

    public Product Product { get; set; }
}