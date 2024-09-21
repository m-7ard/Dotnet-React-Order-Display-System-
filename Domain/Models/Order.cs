using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;

namespace Domain.Models;
public class Order
{
    public Order(int id, decimal total, DateTime dateCreated, DateTime dateFinished, List<OrderItem> orderItems, OrderStatus status)
    {
        Id = id;
        Total = total;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        OrderItems = orderItems;
        Status = status;
    }

    public int Id { get; private set; }
    public decimal Total { get; set; }
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

    public void UpdateOrderItemStatus(int orderItemId, OrderItemStatus status)
    {
        var orderItem = OrderItems.Find(orderItem => orderItem.Id == orderItemId);
        if (orderItem is null)
        {
            throw new Exception($"OrderItem of Id \"{orderItemId}\" does not exist on Order of Id \"{Id}\"");
        }

        orderItem.UpdateStatus(status);
    }
}