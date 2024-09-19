using Application.ApiModels;
using Domain.Models;

namespace Application.Api.Products.Create.DTOs;

public class CreateProductResponseDTO
{
    public CreateProductResponseDTO(ProductApiModel product)
    {
        Product = product;
    }

    public ProductApiModel Product { get; set; }
}