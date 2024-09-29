namespace Application.Api.Orders.List.DTOs;

public class ListOrdersRequestDTO
{
    public ListOrdersRequestDTO(
        decimal? minTotal, 
        decimal? maxTotal, 
        string? status, 
        DateTime? createdBefore, 
        DateTime? createdAfter, 
        int? id, 
        int? productId, 
        int? productHistoryId)
    {
        MinTotal = minTotal;
        MaxTotal = maxTotal;
        Status = status;
        CreatedBefore = createdBefore;
        CreatedAfter = createdAfter;
        Id = id;
        ProductId = productId;
        ProductHistoryId = productHistoryId;
    }

    public decimal? MinTotal { get; set; }
    public decimal? MaxTotal { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public int? Id { get; set; }
    public int? ProductId { get; set; }
    public int? ProductHistoryId { get; set; }
}