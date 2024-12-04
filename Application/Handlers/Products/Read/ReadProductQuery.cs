using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Read;

public class ReadProductQuery : IRequest<OneOf<ReadProductResult, List<ApplicationError>>>
{
    public ReadProductQuery(int id)
    {
        Id = id;
    }

    public int Id { get; set; }
}