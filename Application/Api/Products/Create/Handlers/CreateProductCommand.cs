using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Products.Create.Handlers;

public class CreateProductCommand : IRequest<OneOf<CreateProductResult, List<PlainApplicationError>>>
{
    public CreateProductCommand(string name)
    {
        Name = name;
    }

    public string Name { get; set; }
}