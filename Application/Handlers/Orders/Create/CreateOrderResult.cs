namespace Application.Handlers.Orders.Create;

public class CreateOrderResult
{
    public CreateOrderResult(Guid orderId)
    {
        OrderId = orderId;
    }

    public Guid OrderId { get; set; }
}