using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Create;

public class CreateProductCommand : IRequest<OneOf<CreateProductResult, List<PlainApplicationError>>>
{
    public CreateProductCommand(string name, decimal price, string description, List<string> images)
    {
        Name = name;
        Price = price;
        Description = description;
        Images = images;
    }

    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public List<string> Images { get; set; }
}