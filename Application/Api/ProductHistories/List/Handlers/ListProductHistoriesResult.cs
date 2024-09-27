using Domain.Models;

namespace Application.Api.ProductHistories.List.Handlers;

public class ListProductHistoriesResult
{
    public ListProductHistoriesResult(List<ProductHistory> productHistories)
    {
        ProductHistories = productHistories;
    }

    public List<ProductHistory> ProductHistories { get; set; }
}