using Api.ApiModels;

namespace Api.DTOs.Products.Update;

public class UpdateProductResponseDTO
{
    public UpdateProductResponseDTO(ProductApiModel product)
    {
        Product = product;
    }

    public ProductApiModel Product { get; set; }
}