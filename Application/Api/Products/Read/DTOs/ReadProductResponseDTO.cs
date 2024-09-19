using Application.ApiModels;

namespace Application.Api.Products.Read.DTOs;

public class ReadProductResponseDTO
{
    public ReadProductResponseDTO(ProductApiModel product)
    {
        Product = product;
    }

    public ProductApiModel Product { get; set; }
}