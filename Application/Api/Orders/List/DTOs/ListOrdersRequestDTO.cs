namespace Application.Api.Orders.List.DTOs;

public class ListOrdersRequestDTO
{
    public ListOrdersRequestDTO(decimal? minTotal, decimal? maxTotal, string? status, DateTime? createdBefore, DateTime? createdAfter)
    {
        MinTotal = minTotal;
        MaxTotal = maxTotal;
        Status = status;
        CreatedBefore = createdBefore;
        CreatedAfter = createdAfter;
    }

    public decimal? MinTotal { get; set; }
    public decimal? MaxTotal { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? CreatedAfter { get; set; }
}