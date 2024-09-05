namespace Domain.Models;

public class ProductImage
{
    public ProductImage(int id, string fileName, DateTime dateCreated, int? productId)
    {
        Id = id;
        FileName = fileName;
        DateCreated = dateCreated;
        ProductId = productId;
    }

    public int Id { get; set; }
    public string FileName { get; set; }
    public DateTime DateCreated { get; set; }
    public int? ProductId { get; set; }
}