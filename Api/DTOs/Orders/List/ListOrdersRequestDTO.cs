namespace Api.DTOs.Orders.List;

public class ListOrdersRequestDTO
{
    public ListOrdersRequestDTO(
        decimal? minTotal,
        decimal? maxTotal,
        string? status,
        DateTime? createdBefore,
        DateTime? createdAfter,
        Guid? id,
        Guid? productId,
        Guid? productHistoryId,
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
    public Guid? Id { get; set; }
    public Guid? ProductId { get; set; }
    public Guid? ProductHistoryId { get; set; }
    public string? OrderBy { get; set; }
}