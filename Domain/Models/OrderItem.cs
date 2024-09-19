using Domain.ValueObjects.OrderItem;

namespace Domain.Models;

public class OrderItem
{
    public OrderItem(int id, int quantity, OrderItemStatus status, DateTime dateCreated, DateTime dateFinished, int orderId, int productHistoryId, int productId)
    {
        Id = id;
        Quantity = quantity;
        Status = status;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        OrderId = orderId;
        ProductHistoryId = productHistoryId;
        ProductId = productId;
    }

    public int Id { get; private set; }
    public int Quantity { get; set; }
    public OrderItemStatus Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime DateFinished { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public int ProductHistoryId { get; set; }

    public void UpdateStatus(OrderItemStatus status)
    {
        Status = status;

        if (status == OrderItemStatus.Finished)
        {
            DateFinished = DateTime.Now;
        }
    }
}