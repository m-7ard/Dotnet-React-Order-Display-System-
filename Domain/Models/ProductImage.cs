namespace Domain.Models;

public class ProductImage
{
    public ProductImage(int id, string fileName, string originalFileName, string url, DateTime dateCreated, int? productId)
    {
        Id = id;
        FileName = fileName;
        OriginalFileName = originalFileName;
        Url = url;
        DateCreated = dateCreated;
        ProductId = productId;
    }

    public int Id { get; private set; }
    public string FileName { get; private set; }
    public string OriginalFileName { get; private set; }
    public string Url { get; private set; }
    public DateTime DateCreated { get; private set; }
    public int? ProductId { get; private set; }
}