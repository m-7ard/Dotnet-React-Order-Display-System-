using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Products.Read.Handlers;

public class ReadProductQuery : IRequest<OneOf<ReadProductResult, List<PlainApplicationError>>>
{
    public ReadProductQuery(int id)
    {
        Id = id;
    }

    public int Id { get; set; }
}