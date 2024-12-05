using Domain.Models;

namespace Domain.DomainFactories;

public class ProductImageFactory
{
    public static ProductImage BuildExistingProductImage(Guid id, string fileName, string originalFileName, string url, DateTime dateCreated, Guid? productId)
    {
        return new ProductImage(
            id: id,
            fileName: fileName,
            originalFileName: originalFileName,
            url: url,
            dateCreated: dateCreated,
            productId: productId
        );
    }

    public static ProductImage BuildNewProductImage(Guid id, string fileName,string originalFileName, string url, Guid productId)
    {
        return new ProductImage(
            id: id,
            fileName: fileName,
            originalFileName: originalFileName,
            url: url,
            dateCreated: new DateTime(),
            productId: productId
        );
    }

    public static ProductImage BuildNewProductImageFromDraftImage(DraftImage source, Guid id, Guid productId)
    {
        return BuildNewProductImage(
            id: id,
            productId: productId,
            fileName: source.FileName,
            originalFileName: source.OriginalFileName,
            url: source.Url
        );
    }
}