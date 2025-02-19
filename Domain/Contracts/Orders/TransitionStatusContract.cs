namespace Domain.Contracts.Orders;

public class TransitionStatusContract
{
    public TransitionStatusContract(string status, DateTime dateCreated, DateTime? dateFinished)
    {
        Status = status;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
    }

    public string Status { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime? DateFinished { get; set; }
}