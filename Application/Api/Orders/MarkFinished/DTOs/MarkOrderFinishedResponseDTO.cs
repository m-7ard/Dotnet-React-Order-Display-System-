using Application.ApiModels;

namespace Application.Api.Orders.MarkFinished.DTOs;

public class MarkOrderFinishedResponseDTO
{
    public MarkOrderFinishedResponseDTO(OrderApiModel order)
    {
        Order = order;
    }

    public OrderApiModel Order { get; set; }
}