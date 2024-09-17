using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Products.Delete.Handlers;

public class DeleteProductCommand : IRequest<OneOf<DeleteProductResult, List<PlainApplicationError>>>
{
    public DeleteProductCommand(int id)
    {
        Id = id;
    }

    public int Id { get; set; }
}