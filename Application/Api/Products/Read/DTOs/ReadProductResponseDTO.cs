using Domain.Models;

namespace Application.Api.Products.Read.DTOs;

public class ReadProductResponseDTO
{
    public ReadProductResponseDTO(Product product)
    {
        Product = product;
    }

    public Product Product { get; set; }
}