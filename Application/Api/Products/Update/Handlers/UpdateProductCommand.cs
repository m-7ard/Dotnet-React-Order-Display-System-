using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Products.Update.Handlers;

public class UpdateProductCommand : IRequest<OneOf<UpdateProductResult, List<PlainApplicationError>>>
{
    public UpdateProductCommand(string name, float price, string description, List<string> images, int id)
    {
        Name = name;
        Price = price;
        Description = description;
        Images = images;
        Id = id;
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public float Price { get; set; }
    public string Description { get; set; }
    public List<string> Images { get; set; }
}