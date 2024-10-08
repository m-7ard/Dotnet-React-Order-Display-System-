using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Orders.List.Handlers;

public class ListOrdersQuery : IRequest<OneOf<ListOrdersResult, List<PlainApplicationError>>>
{
    public ListOrdersQuery(
        decimal? minTotal,
        decimal? maxTotal,
        string? status,
        DateTime? createdBefore,
        DateTime? createdAfter,
        int? id,
        int? productId,
        int? productHistoryId,
        string? orderBy)
    {
        MinTotal = minTotal;
        MaxTotal = maxTotal;
        Status = status;
        CreatedBefore = createdBefore;
        CreatedAfter = createdAfter;
        Id = id;
        ProductId = productId;
        ProductHistoryId = productHistoryId;
        OrderBy = orderBy;
    }

    public decimal? MinTotal { get; set; }
    public decimal? MaxTotal { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public int? Id { get; set; }
    public int? ProductId { get; set; }
    public int? ProductHistoryId { get; set; }
    public string? OrderBy { get; set; }
}