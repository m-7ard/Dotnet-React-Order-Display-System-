using Domain.Models;

namespace Application.Api.Orders.Create.DTOs;

public class CreateOrderResponseDTO
{
    public CreateOrderResponseDTO(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}