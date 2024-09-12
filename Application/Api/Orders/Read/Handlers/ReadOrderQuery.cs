using Application.ErrorHandling.Application;
using Domain.ValueObjects.Order;
using MediatR;
using OneOf;

namespace Application.Api.Orders.Read.Handlers;

public class ReadOrderQuery : IRequest<OneOf<ReadOrderResult, List<PlainApplicationError>>>
{
    public ReadOrderQuery(int id)
    {
        Id = id;
    }

    public int Id { get; set; }
}