namespace Api.ApiModels;

public class ProductApiModel
{
    public ProductApiModel(
        int id,
        string name,
        decimal price,
        string description,
        DateTime dateCreated,
        List<ImageApiModel> images)
    {
        Id = id;
        Name = name;
        Price = price;
        Description = description;
        DateCreated = dateCreated;
        Images = images;
    }

    public int Id { get; private set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; private set; }
    public List<ImageApiModel> Images { get; set; }
}