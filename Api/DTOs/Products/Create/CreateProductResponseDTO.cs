using Api.ApiModels;

namespace Api.DTOs.Products.Create;

public class CreateProductResponseDTO
{
    public CreateProductResponseDTO(ProductApiModel product)
    {
        Product = product;
    }

    public ProductApiModel Product { get; set; }
}