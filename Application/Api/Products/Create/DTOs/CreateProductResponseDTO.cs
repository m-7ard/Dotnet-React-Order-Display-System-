using Domain.Models;

namespace Application.Api.Products.Create.DTOs;

public class CreateProductResponseDTO
{
    public CreateProductResponseDTO(Product product)
    {
        Product = product;
    }

    public Product Product { get; set; }
}