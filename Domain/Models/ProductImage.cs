namespace Domain.Models;

public class ProductImage
{
    public ProductImage(Guid id, string fileName, string originalFileName, string url, DateTime dateCreated, Guid? productId)
    {
        Id = id;
        FileName = fileName;
        OriginalFileName = originalFileName;
        Url = url;
        DateCreated = dateCreated;
        ProductId = productId;
    }

    public Guid Id { get; private set; }
    public string FileName { get; private set; }
    public string OriginalFileName { get; private set; }
    public string Url { get; private set; }
    public DateTime DateCreated { get; private set; }
    public Guid? ProductId { get; private set; }
}