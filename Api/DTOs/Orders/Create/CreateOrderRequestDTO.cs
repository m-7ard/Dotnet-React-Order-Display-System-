namespace Api.DTOs.Orders.Create;

public class CreateOrderRequestDTO
{
    public CreateOrderRequestDTO(Dictionary<string, OrderItem> orderItemData)
    {
        OrderItemData = orderItemData;
    }

    public Dictionary<string, OrderItem> OrderItemData { get; set; }

    public class OrderItem
    {
        public OrderItem(string productId, int quantity)
        {
            ProductId = productId;
            Quantity = quantity;
        }

        public string ProductId { get; set; }
        public int Quantity { get; set; }
    }
}