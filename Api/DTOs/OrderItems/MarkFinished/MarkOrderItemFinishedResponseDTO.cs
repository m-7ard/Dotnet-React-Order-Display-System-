namespace Api.DTOs.OrderItems.MarkFinished;

public class MarkOrderItemFinishedResponseDTO
{
    public MarkOrderItemFinishedResponseDTO(string orderId, string orderItemId)
    {
        OrderId = orderId;
        OrderItemId = orderItemId;
    }

    public string OrderId { get; set; }
    public string OrderItemId { get; set; }
}