namespace Application.Api.Products.Create.DTOs;

public class CreateProductRequestDTO
{
    public CreateProductRequestDTO(string name, float price, string description, List<string> images)
    {
        Name = name;
        Price = price;
        Description = description;
        Images = images;
    }

    public string Name { get; set; }
    public float Price { get; set; }
    public string Description { get; set; }
    public List<string> Images { get; set; }
}