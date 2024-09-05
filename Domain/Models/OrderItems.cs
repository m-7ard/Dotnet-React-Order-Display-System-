using Domain.ValueObjects.OrderItem;

namespace Domain.Models;
public class OrderItem
{
    public OrderItem(int id, int quantity, OrderItemStatus status, DateTime dateCreated, DateTime dateFinished, int orderId, ProductHistory productHistory)
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
    public OrderItemStatus Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime DateFinished { get; set; }
    public int OrderId { get; set; }
    public ProductHistory ProductHistory { get; set; }

    public void UpdateStatus(OrderItemStatus status)
    {
        Status = status;

        if (status == OrderItemStatus.Finished)
        {
            DateFinished = DateTime.Now;
        }
    }
}