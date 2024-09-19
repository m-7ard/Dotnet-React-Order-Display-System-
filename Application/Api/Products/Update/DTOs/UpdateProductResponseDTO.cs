using Application.ApiModels;
using Domain.Models;

namespace Application.Api.Products.Update.DTOs;

public class UpdateProductResponseDTO
{
    public UpdateProductResponseDTO(ProductApiModel product)
    {
        Product = product;
    }

    public ProductApiModel Product { get; set; }
}