using Domain.Models;

namespace Application.Api.Orders.List.DTOs;

public class ListOrdersResponseDTO
{
    public ListOrdersResponseDTO(List<Order> orders)
    {
        Orders = orders;
    }

    public List<Order> Orders { get; set; }
}