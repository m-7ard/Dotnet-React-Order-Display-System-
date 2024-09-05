namespace Application.Api.Orders.Create.Other;

public class OrderItemData
{
    public OrderItemData(int productId, int quantity)
    {
        ProductId = productId;
        Quantity = quantity;
    }

    public int ProductId { get; set; }
    public int Quantity { get; set; }
}