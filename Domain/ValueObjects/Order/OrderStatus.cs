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

    private static readonly List<OrderStatus> ValidStatuses = new List<OrderStatus>
    {
        Pending,
        Finished
    };

    public static bool IsValid(string status)
    {
        return ValidStatuses.Exists(d => d.Name == status);
    }

    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Name;
    }
}