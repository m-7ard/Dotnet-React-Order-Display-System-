namespace Infrastructure.DbEntities;

public class ProductImageDbEntity
{
    public ProductImageDbEntity(int id, string fileName, DateTime dateCreated, int? productId)
    {
        Id = id;
        FileName = fileName;
        DateCreated = dateCreated;
        ProductId = productId;
    }

    public int Id { get; private set; }
    public string FileName { get; private set; }
    public DateTime DateCreated { get; private set; }
    
    // Product FK
    public int? ProductId { get; set; }
    public ProductDbEntity? Product { get; private set; }
}