using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Products.List.Handlers;

public class ListProductsQuery : IRequest<OneOf<ListProductsResult, List<PlainApplicationError>>>
{
    public ListProductsQuery(string? name, float? minPrice, float? maxPrice, string? description, DateTime? createdBefore, DateTime? createdAfter)
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