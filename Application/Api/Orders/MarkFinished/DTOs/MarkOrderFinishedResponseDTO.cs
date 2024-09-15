using Domain.Models;

namespace Application.Api.Orders.MarkFinished.DTOs;

public class MarkOrderFinishedResponseDTO
{
    public MarkOrderFinishedResponseDTO(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}