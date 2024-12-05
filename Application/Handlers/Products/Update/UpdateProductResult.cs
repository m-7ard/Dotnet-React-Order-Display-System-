using Domain.Models;

namespace Application.Handlers.Products.Update;

public class UpdateProductResult
{
    public UpdateProductResult(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}