using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Products.List.Handlers;

public class ListProductsQuery : IRequest<OneOf<ListProductsResult, List<PlainApplicationError>>>
{
    public ListProductsQuery(string? name, decimal? minPrice, decimal? maxPrice, string? description, DateTime? createdBefore, DateTime? createdAfter, int? id)
    {
        Name = name;
        MinPrice = minPrice;
        MaxPrice = maxPrice;
        Description = description;
        CreatedBefore = createdBefore;
        CreatedAfter = createdAfter;
        Id = id;
    }

    public int? Id { get; set; }
    public string? Name { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? CreatedAfter { get; set; }
}