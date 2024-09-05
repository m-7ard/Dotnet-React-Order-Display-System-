using Application.Api.Orders.Create.Other;

namespace Application.Api.Orders.Create.DTOs;

public class CreateOrderRequestDTO
{
    public CreateOrderRequestDTO(Dictionary<string, OrderItemData> orderItemData)
    {
        OrderItemData = orderItemData;
    }

    public Dictionary<string, OrderItemData> OrderItemData { get; set; }
}