namespace Application.ApiModels;

public class ProductHistoryApiModel
{
    public ProductHistoryApiModel(int id, string name, List<string> images, string description, float price, int productId, DateTime validFrom, DateTime validTo)
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
    public string Name { get; set; }
    public List<string> Images { get; set; }
    public string Description { get; set; }
    public float Price { get; set; }
    public int ProductId { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
}