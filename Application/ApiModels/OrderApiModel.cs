namespace Application.ApiModels;

public class OrderApiModel
{
    public OrderApiModel(int id, float total, DateTime dateCreated, DateTime dateFinished, List<OrderItemApiModel> orderItems, string status)
    {
        Id = id;
        Total = total;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        OrderItems = orderItems;
        Status = status;
    }

    public int Id { get; private set; }
    public float Total { get; set; }
    public string Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime DateFinished { get; set; }
    public List<OrderItemApiModel> OrderItems { get; set; }
}