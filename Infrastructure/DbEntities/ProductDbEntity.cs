namespace Infrastructure.DbEntities;
public class ProductDbEntity
{
    public ProductDbEntity(int id, string name, DateTime dateCreated, decimal price, string description)
    {
        Id = id;
        Name = name;
        DateCreated = dateCreated;
        Price = price;
        Description = description;
    }

    public int Id { get; private set; }
    public string Name { get; set; }
    public DateTime DateCreated { get; private set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public List<ProductImageDbEntity> Images { get; set; } = [];
    public List<ProductHistoryDbEntity> ProductHistories { get; set; } = [];
}