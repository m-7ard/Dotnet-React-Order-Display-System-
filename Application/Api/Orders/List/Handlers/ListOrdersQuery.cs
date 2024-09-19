using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Orders.List.Handlers;

/* TODO: add filter by productId in items and implement in fe */

public class ListOrdersQuery : IRequest<OneOf<ListOrdersResult, List<PlainApplicationError>>>
{
    public ListOrdersQuery(float? minTotal, float? maxTotal, string? status, DateTime? createdBefore, DateTime? createdAfter)
    {
        MinTotal = minTotal;
        MaxTotal = maxTotal;
        Status = status;
        CreatedBefore = createdBefore;
        CreatedAfter = createdAfter;
    }

    public float? MinTotal { get; set; }
    public float? MaxTotal { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? CreatedAfter { get; set; }
}