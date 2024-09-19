using Application.ApiModels;
using Domain.Models;

namespace Application.Api.OrderItems.MarkFinished.DTOs;

public class MarkOrderItemFinishedResponseDTO
{
    public MarkOrderItemFinishedResponseDTO(OrderApiModel order)
    {
        Order = order;
    }

    public OrderApiModel Order { get; set; }
}