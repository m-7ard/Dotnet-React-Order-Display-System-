using Api.ApiModels;

namespace Api.DTOs.Orders.Create;

public class CreateOrderResponseDTO
{
    public CreateOrderResponseDTO(OrderApiModel order)
    {
        Order = order;
    }

    public OrderApiModel Order { get; set; }
}