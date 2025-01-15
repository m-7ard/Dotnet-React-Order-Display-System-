using Domain.Models;
using Domain.ValueObjects.Product;

namespace Application.Handlers.Products.Update;

public class UpdateProductResult
{
    public UpdateProductResult(ProductId id)
    {
        Id = id;
    }

    public ProductId Id { get; set; }
}