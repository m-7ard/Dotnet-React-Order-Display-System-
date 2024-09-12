using Domain.Models;

namespace Application.Api.Orders.Read.DTOs;

public class ReadOrderResponseDTO
{
    public ReadOrderResponseDTO(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}