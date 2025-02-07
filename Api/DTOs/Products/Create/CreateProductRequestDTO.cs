namespace Api.DTOs.Products.Create;

public class CreateProductRequestDTO
{
    public CreateProductRequestDTO(string name, decimal price, string description, List<string> images)
    {
        Name = name;
        Price = price;
        Description = description;
        Images = images;
    }

    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public List<string> Images { get; set; }
}