using Api.ApiModels;

namespace Api.DTOs.OrderItems.MarkFinished;

public class MarkOrderItemFinishedResponseDTO
{
    public MarkOrderItemFinishedResponseDTO(OrderApiModel order)
    {
        Order = order;
    }

    public OrderApiModel Order { get; set; }
}