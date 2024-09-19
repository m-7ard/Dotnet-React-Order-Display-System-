using Application.ApiModels;
using Domain.Models;

namespace Application.Api.Orders.Create.DTOs;

public class CreateOrderResponseDTO
{
    public CreateOrderResponseDTO(OrderApiModel order)
    {
        Order = order;
    }

    public OrderApiModel Order { get; set; }
}