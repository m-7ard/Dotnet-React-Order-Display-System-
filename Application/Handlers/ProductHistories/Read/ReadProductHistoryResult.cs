using Domain.Models;

namespace Application.Handlers.ProductHistories.Read;

public class ReadProductHistoryResult
{
    public ReadProductHistoryResult(ProductHistory productHistory)
    {
        ProductHistory = productHistory;
    }

    public ProductHistory ProductHistory { get; set; }
}