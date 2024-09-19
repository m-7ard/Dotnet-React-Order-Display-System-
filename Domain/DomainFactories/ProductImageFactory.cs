using Domain.Models;

namespace Domain.DomainFactories;

public class ProductImageFactory
{
    public static ProductImage BuildExistingProductImage(int id, string fileName, string originalFileName, string url, DateTime dateCreated, int? productId)
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

    public static ProductImage BuildNewProductImage(string fileName,string originalFileName, string url)
    {
        return new ProductImage(
            id: 0,
            fileName: fileName,
            originalFileName: originalFileName,
            url: url,
            dateCreated: new DateTime(),
            productId: 0
        );
    }

    public static ProductImage BuildNewProductImageFromDraftImage(DraftImage source)
    {
        return BuildNewProductImage(
            fileName: source.FileName,
            originalFileName: source.OriginalFileName,
            url: source.Url
        );
    }
}