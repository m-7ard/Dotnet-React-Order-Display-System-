using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.ProductHistories.Read;

public class ReadProductHistoryQuery : IRequest<OneOf<ReadProductHistoryResult, List<ApplicationError>>>
{
    public ReadProductHistoryQuery(int id)
    {
        Id = id;
    }

    public int Id { get; set; }
}