using Application.ApiModels;

namespace Application.Api.Products.List.DTOs;

public class ListProductsResponseDTO
{
    public ListProductsResponseDTO(List<ProductApiModel> products)
    {
        Products = products;
    }

    public List<ProductApiModel> Products { get; set; }
}