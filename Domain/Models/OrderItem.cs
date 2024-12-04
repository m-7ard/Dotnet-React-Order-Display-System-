using Domain.ValueObjects.OrderItem;

namespace Domain.Models;

public class OrderItem
{
    public OrderItem(Guid id, int quantity, OrderItemStatus status, DateTime dateCreated, DateTime dateFinished, Guid orderId, int productHistoryId, int productId, int serialNumber)
    {
        Id = id;
        Quantity = quantity;
        Status = status;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        OrderId = orderId;
        ProductHistoryId = productHistoryId;
        ProductId = productId;
        SerialNumber = serialNumber;
    }

    public Guid Id { get; private set; }
    public int SerialNumber { get; private set; }
    public int Quantity { get; set; }
    public OrderItemStatus Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime DateFinished { get; set; }
    public Guid OrderId { get; set; }
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