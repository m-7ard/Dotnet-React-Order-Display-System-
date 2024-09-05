using Domain.Models;

namespace Application.Api.Products.List.DTOs;

public class ListProductsResponseDTO
{
    public ListProductsResponseDTO(List<Product> products)
    {
        Products = products;
    }

    public List<Product> Products { get; set; }
}