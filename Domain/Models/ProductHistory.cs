namespace Domain.Models;

public class ProductHistory
{
    public ProductHistory(
        int id,
        string name,
        List<string> images,
        float price,
        int? productId,
        DateTime validFrom,
        DateTime validTo,
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

    public int Id { get; private set; }
    public string Name { get; set; }
    public List<string> Images { get; set; }
    public string Description { get; set; }
    public float Price { get; set; }
    public int? ProductId { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
}