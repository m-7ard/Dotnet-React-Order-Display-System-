using Api.ApiModels;

namespace Api.DTOs.Orders.MarkFinished;

public class MarkOrderFinishedResponseDTO
{
    public MarkOrderFinishedResponseDTO(OrderApiModel order)
    {
        Order = order;
    }

    public OrderApiModel Order { get; set; }
}