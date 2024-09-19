namespace Application.ApiModels;

public class OrderItemApiModel
{
    public OrderItemApiModel(int id, int quantity, string status, DateTime dateCreated, DateTime dateFinished, int orderId, ProductHistoryApiModel productHistory)
    {
        Id = id;
        Quantity = quantity;
        Status = status;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        OrderId = orderId;
        ProductHistory = productHistory;
    }

    public int Id { get; private set; }
    public int Quantity { get; set; }
    public string Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime DateFinished { get; set; }
    public int OrderId { get; set; }
    public ProductHistoryApiModel ProductHistory { get; set; }
}