using Application.ApiModels;

namespace Application.Api.Orders.List.DTOs;

public class ListOrdersResponseDTO
{
    public ListOrdersResponseDTO(List<OrderApiModel> orders)
    {
        Orders = orders;
    }

    public List<OrderApiModel> Orders { get; set; }
}