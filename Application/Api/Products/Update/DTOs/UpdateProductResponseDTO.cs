using Domain.Models;

namespace Application.Api.Products.Update.DTOs;

public class UpdateProductResponseDTO
{
    public UpdateProductResponseDTO(Product product)
    {
        Product = product;
    }

    public Product Product { get; set; }
}