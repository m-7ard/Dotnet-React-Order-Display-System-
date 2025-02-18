using Domain.Models;

namespace Domain.Contracts.Orders;

public class AddOrderItemContract
{
    public AddOrderItemContract(Guid id, Product product, ProductHistory productHistory, int quantity, string status, int serialNumber, DateTime dateCreated, DateTime? dateFinished)
    {
        Id = id;
        Product = product;
        ProductHistory = productHistory;
        Quantity = quantity;
        Status = status;
        SerialNumber = serialNumber;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
    }

    public Guid Id { get; set; }
    public Product Product { get; set; }
    public ProductHistory ProductHistory { get; set; }
    public int Quantity { get; set; }
    public string Status { get; set; }
    public int SerialNumber { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime? DateFinished { get; set; }
}