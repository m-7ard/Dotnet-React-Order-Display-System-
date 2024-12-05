namespace Application.Handlers.Products.Create;

public class CreateProductResult
{
    public CreateProductResult(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}