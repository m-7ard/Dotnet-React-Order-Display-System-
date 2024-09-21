namespace Infrastructure.DbEntities;

public class ProductHistoryDbEntity
{
    public ProductHistoryDbEntity(
        int id,
        string name,
        List<string> images,
        string description,
        decimal price,
        int? productId,
        DateTime validFrom,
        DateTime validTo,
        int originalProductId)
    {
        Id = id;
        Name = name;
        Images = images;
        Description = description;
        Price = price;
        ProductId = productId;
        ValidFrom = validFrom;
        ValidTo = validTo;
        OriginalProductId = originalProductId;
    }

    public int Id { get; private set; }
    public string Name { get; set; } = null!;
    public List<string> Images { get; set; } = [];
    public string Description { get; set; } = null!;
    public decimal Price { get; set; }

    // Product FK
    public int? ProductId { get; set; }
    public ProductDbEntity? Product { get; set; }

    public int OriginalProductId { get; set; }
    
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
}
