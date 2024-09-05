namespace Domain.Models;
public class Product
{
    public Product(
        int id, 
        string name, 
        float price, 
        string description, 
        DateTime dateCreated, 
        List<ProductImage> images)
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
    public float Price { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; private set; }
    public List<ProductImage> Images { get; set; }
}