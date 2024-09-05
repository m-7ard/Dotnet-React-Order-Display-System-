namespace Domain.ValueObjects.OrderItem;

public class OrderItemStatus : ValueObject
{
    public static OrderItemStatus Pending => new OrderItemStatus("Pending");
    public static OrderItemStatus Finished => new OrderItemStatus("Finished");

    public string Name { get; }

    public OrderItemStatus(string name)
    {
        Name = name;
    }

    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Name;
    }
}