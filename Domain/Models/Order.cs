using Domain.ValueObjects.Order;

namespace Domain.Models;
public class Order
{
    public Order(int id, float total, DateTime dateCreated, DateTime dateFinished, List<OrderItem> orderItems, OrderStatus status)
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
    public OrderStatus Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime DateFinished { get; set; }
    public List<OrderItem> OrderItems { get; set; }

    public void UpdateStatus(OrderStatus status)
    {
        Status = status;

        if (status == OrderStatus.Finished)
        {
            DateFinished = DateTime.Now;
        }
    }
}