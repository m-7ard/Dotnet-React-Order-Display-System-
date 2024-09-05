using Domain.Models;

namespace Domain.DomainFactories;

public class ProductImageFactory
{
    public static ProductImage BuildExistingProductImage(int id, string fileName, DateTime dateCreated, int? productId)
    {
        return new ProductImage(
            id: id,
            dateCreated: dateCreated,
            fileName: fileName,
            productId: productId
        );
    }

    public static ProductImage BuildNewProductImage(string fileName)
    {
        return new ProductImage(
            id: 0,
            dateCreated: new DateTime(),
            fileName: fileName,
            productId: null
        );
    }
}