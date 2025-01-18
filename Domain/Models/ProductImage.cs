using Domain.ValueObjects.DraftImage;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductImage;

namespace Domain.Models;

public class ProductImage
{
    public ProductImage(ProductImageId id, FileName fileName, FileName originalFileName, string url, DateTime dateCreated, ProductId? productId)
    {
        Id = id;
        FileName = fileName;
        OriginalFileName = originalFileName;
        Url = url;
        DateCreated = dateCreated;
        ProductId = productId;
    }

    public ProductImageId Id { get; private set; }
    public FileName FileName { get; private set; }
    public FileName OriginalFileName { get; private set; }
    public string Url { get; private set; }
    public DateTime DateCreated { get; private set; }
    public ProductId? ProductId { get; private set; }
}