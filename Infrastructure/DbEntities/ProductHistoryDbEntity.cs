namespace Infrastructure.DbEntities;

public class ProductHistoryDbEntity
{
    public ProductHistoryDbEntity(
        int id, 
        string name, 
        List<string> images, 
        string description, 
        float price, 
        int? productId, 
        DateTime validFrom, 
        DateTime validTo)
    {
        Id = id;
        Name = name;
        Images = images;
        Description = description;
        Price = price;
        ProductId = productId;
        ValidFrom = validFrom;
        ValidTo = validTo;
    }

    public int Id { get; private set; }
    public string Name { get; set; } = null!;
    public List<string> Images { get; set; } = [];
    public string Description { get; set; } = null!;
    public float Price { get; set; }

    // Product FK
    public int? ProductId { get; set; }
    public ProductDbEntity? Product { get; private set; }
    
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
}
