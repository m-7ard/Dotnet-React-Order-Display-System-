using Domain.Models;

namespace Domain.Contracts.Orders;

public class AddNewOrderItemContract
{
    public AddNewOrderItemContract(Order order, Guid id, Product product, ProductHistory productHistory, int quantity, int serialNumber)
    {
        Order = order;
        Id = id;
        Product = product;
        ProductHistory = productHistory;
        Quantity = quantity;
        SerialNumber = serialNumber;
    }

    public Order Order { get; set; }
    public Guid Id { get; set; }
    public Product Product { get; set; }
    public ProductHistory ProductHistory { get; set; }
    public int Quantity { get; set; }
    public int SerialNumber { get; set; }
}