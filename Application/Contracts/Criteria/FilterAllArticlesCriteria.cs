using Domain.ValueObjects.Order;

namespace Application.Contracts.Criteria;

public class FilterOrdersCriteria : IEquatable<FilterOrdersCriteria>
{
    public FilterOrdersCriteria(
        decimal? minTotal,
        decimal? maxTotal,
        OrderStatus? status,
        DateTime? createdBefore,
        DateTime? createdAfter,
        int? productId,
        Guid? id,
        int? productHistoryId,
        Tuple<string, bool>? orderBy)
    {
        MinTotal = minTotal;
        MaxTotal = maxTotal;
        Status = status;
        CreatedBefore = createdBefore;
        CreatedAfter = createdAfter;
        ProductId = productId;
        Id = id;
        ProductHistoryId = productHistoryId;
        OrderBy = orderBy;
    }

    public decimal? MinTotal { get; set; }
    public decimal? MaxTotal { get; set; }
    public OrderStatus? Status { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public int? ProductId { get; set; }
    public Guid? Id { get; set; }
    public int? ProductHistoryId { get; set; }
    public Tuple<string, bool>? OrderBy { get; set; }

    // For Unit Testing
    public bool Equals(FilterOrdersCriteria? other)
    {
        if (other == null)
            return false;

        return MinTotal == other.MinTotal &&
                MaxTotal == other.MaxTotal &&
                ((Status is null && other.Status is null) || (Status is not null && other.Status is not null && Status == other.Status)) &&
                CreatedBefore == other.CreatedBefore &&
                CreatedAfter == other.CreatedAfter &&
                ProductId == other.ProductId &&
                Id == other.Id &&
                ProductHistoryId == other.ProductHistoryId &&
                Equals(OrderBy, other.OrderBy);
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as FilterOrdersCriteria);
    }

    public override int GetHashCode()
    {
        var hash = new HashCode();
        hash.Add(MinTotal);
        hash.Add(MaxTotal);
        hash.Add(Status);
        hash.Add(CreatedBefore);
        hash.Add(CreatedAfter);
        hash.Add(ProductId);
        hash.Add(Id);
        hash.Add(ProductHistoryId);
        hash.Add(OrderBy);
        return hash.ToHashCode();
    }
}