using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Update;

public class UpdateProductCommand : IRequest<OneOf<UpdateProductResult, List<ApplicationError>>>
{
    public UpdateProductCommand(string name, decimal price, string description, List<string> images, int id)
    {
        Name = name;
        Price = price;
        Description = description;
        Images = images;
        Id = id;
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public List<string> Images { get; set; }
}