using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;

namespace Domain.Models;

public class ProductHistory
{
    public ProductHistory(
        ProductHistoryId id,
        string name,
        List<string> images,
        decimal price,
        ProductId productId,
        DateTime validFrom,
        DateTime? validTo,
        string description)
    {
        Id = id;
        Name = name;
        Images = images;
        Price = price;
        ProductId = productId;
        ValidFrom = validFrom;
        ValidTo = validTo;
        Description = description;
    }

    public ProductHistoryId Id { get; private set; }
    public string Name { get; set; }
    public List<string> Images { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public ProductId ProductId { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }

    public void Invalidate()
    {
        ValidTo = DateTime.UtcNow;
    }

    public bool IsValid()
    {
        return ValidTo is null;
    }
}