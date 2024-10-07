namespace Application.Api.Products.List.DTOs;

public class ListProductsRequestDTO
{
    public ListProductsRequestDTO(
        string? name,
        decimal? minPrice,
        decimal? maxPrice,
        string? description,
        DateTime? createdBefore,
        DateTime? createdAfter,
        int? id,
        string? orderBy)
    {
        Name = name;
        MinPrice = minPrice;
        MaxPrice = maxPrice;
        Description = description;
        CreatedBefore = createdBefore;
        CreatedAfter = createdAfter;
        Id = id;
        OrderBy = orderBy;
    }

    public int? Id { get; set; }
    public string? Name { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public string? OrderBy { get; set; }
}