namespace Infrastructure.DbEntities;

public class OrderItemDbEntity
{
    public enum Statuses
    {
        Pending,
        Finished
    }

    public OrderItemDbEntity(
        int id,
        int quantity,
        Statuses status,
        DateTime dateCreated,
        DateTime dateFinished,
        int orderId,
        int productHistoryId,
        int productId)
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
    public Statuses Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime DateFinished { get; set; }
    public int ProductId { get; set; }

    // Order FK
    public int OrderId { get; set; }
    public OrderDbEntity Order { get; private set; } = null!;

    // Product History FK
    public int ProductHistoryId { get; set; }
    public ProductHistoryDbEntity ProductHistory { get; set; } = null!;
}