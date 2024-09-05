namespace Domain.ValueObjects.Order;

public class OrderStatus : ValueObject
{
    public static OrderStatus Pending => new OrderStatus("Pending");
    public static OrderStatus Finished => new OrderStatus("Finished");

    public string Name { get; }

    public OrderStatus(string name)
    {
        Name = name;
    }

    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Name;
    }
}