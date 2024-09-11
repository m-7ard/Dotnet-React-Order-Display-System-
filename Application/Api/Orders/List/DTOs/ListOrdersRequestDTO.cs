using Application.Api.Orders.List.Handlers;
using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Orders.List.DTOs;

public class ListOrdersRequestDTO : IRequest<OneOf<ListOrdersResult, List<PlainApplicationError>>>
{
    public ListOrdersRequestDTO(float? minTotal, float? maxTotal, string? status, DateTime? createdBefore, DateTime? createdAfter)
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