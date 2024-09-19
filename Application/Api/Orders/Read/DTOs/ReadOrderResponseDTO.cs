using Application.ApiModels;
using Domain.Models;

namespace Application.Api.Orders.Read.DTOs;

public class ReadOrderResponseDTO
{
    public ReadOrderResponseDTO(OrderApiModel order)
    {
        Order = order;
    }

    public OrderApiModel Order { get; set; }
}