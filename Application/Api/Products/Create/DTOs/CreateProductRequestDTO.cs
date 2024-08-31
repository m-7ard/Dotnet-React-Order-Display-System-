namespace Application.Api.Products.Create.DTOs;

public class CreateProductRequestDTO
{
    public CreateProductRequestDTO(string name)
    {
        Name = name;
    }

    public string Name { get; set; }
}