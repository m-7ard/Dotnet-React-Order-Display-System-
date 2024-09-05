namespace Application.Api.Products.List.DTOs;

public class ListProductsRequestDTO
{
    public ListProductsRequestDTO(
        string? name, 
        float? minPrice, 
        float? maxPrice, 
        string? description, 
        DateTime? createdBefore, 
        DateTime? createdAfter)
    {
        Name = name;
        MinPrice = minPrice;
        MaxPrice = maxPrice;
        Description = description;
        CreatedBefore = createdBefore;
        CreatedAfter = createdAfter;
    }

    public string? Name { get; set; }
    public float? MinPrice { get; set; }
    public float? MaxPrice { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? CreatedAfter { get; set; }
}