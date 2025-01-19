using OneOf;

namespace Domain.ValueObjects.Order;

public class OrderDates
{
    public OrderDates(DateTime dateCreated, DateTime? dateFinished)
    {
        DateCreated = dateCreated;
        DateFinished = dateFinished;
    }

    public DateTime DateCreated { get; }
    public DateTime? DateFinished { get; }

    public static OneOf<bool, string> CanCreate(DateTime dateCreated, DateTime? dateFinished)
    {
        var currentDate = DateTime.UtcNow;
        if (dateCreated > DateTime.UtcNow)
        {
            return $"Date created ({ dateCreated }) cannot be larger than current date ({ currentDate }).";
        }

        if (dateFinished is not null && dateFinished < dateCreated)
        {
            return $"Date finished ({ dateFinished }) cannot be smaller than date created ({ dateCreated })";
        }

        return true;
    }

    public static OrderDates ExecuteCreate(DateTime dateCreated, DateTime? dateFinished)
    {
        var canCreateResult = CanCreate(dateCreated, dateFinished);
        if (canCreateResult.TryPickT1(out var error, out var _))
        {
            throw new Exception(error);
        }

        return new OrderDates(dateCreated: dateCreated, dateFinished: dateFinished);
    }
}