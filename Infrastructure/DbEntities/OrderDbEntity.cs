namespace Infrastructure.DbEntities;
public class OrderDbEntity
{
   public enum Statuses
    {
        Pending,
        Finished
    }

    public OrderDbEntity(int id, decimal total, DateTime dateCreated, DateTime dateFinished, Statuses status)
    {
        Id = id;
        Total = total;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        Status = status;
    }

    public int Id { get; private set; }
    public decimal Total { get; set; }
    public Statuses Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime DateFinished { get; set; }

    // Order Item RFK
    public List<OrderItemDbEntity> OrderItems { get; set; } = [];
}