using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Read;

public class ReadOrderQuery : IRequest<OneOf<ReadOrderResult, List<PlainApplicationError>>>
{
    public ReadOrderQuery(int id)
    {
        Id = id;
    }

    public int Id { get; set; }
}