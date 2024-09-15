using Domain.Models;

namespace Application.Api.OrderItems.MarkFinished.DTOs;

public class MarkOrderItemFinishedResponseDTO
{
    public MarkOrderItemFinishedResponseDTO(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}