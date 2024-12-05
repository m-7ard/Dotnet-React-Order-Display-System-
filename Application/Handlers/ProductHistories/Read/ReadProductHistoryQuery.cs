using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.ProductHistories.Read;

public class ReadProductHistoryQuery : IRequest<OneOf<ReadProductHistoryResult, List<ApplicationError>>>
{
    public ReadProductHistoryQuery(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}