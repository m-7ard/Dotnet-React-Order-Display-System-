namespace Api.DTOs.Orders.MarkFinished;

public class MarkOrderFinishedResponseDTO
{
    public MarkOrderFinishedResponseDTO(string orderId)
    {
        OrderId = orderId;
    }

    public string OrderId { get; set; }
}