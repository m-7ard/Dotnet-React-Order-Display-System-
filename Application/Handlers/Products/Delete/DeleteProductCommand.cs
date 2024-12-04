using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Delete;

public class DeleteProductCommand : IRequest<OneOf<DeleteProductResult, List<ApplicationError>>>
{
    public DeleteProductCommand(int id)
    {
        Id = id;
    }

    public int Id { get; set; }
}