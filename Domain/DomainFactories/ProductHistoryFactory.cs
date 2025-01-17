using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;

namespace Domain.DomainFactories;

public class ProductHistoryFactory
{
    public static ProductHistory BuildExistingProductHistory(
        ProductHistoryId id,
        string name,
        List<string> images,
        decimal price,
        ProductId productId,
        DateTime validFrom,
        DateTime? validTo,
        string description)
    {
        return new ProductHistory(
            id: id,
            name: name,
            images: images,
            price: price,
            productId: productId,
            validFrom: validFrom,
            validTo: validTo, 
            description: description
        );
    }

    public static ProductHistory BuildNewProductHistory(
        ProductHistoryId id,
        string name,
        List<string> images,
        decimal price,
        ProductId productId,
        string description)
    {
        return new ProductHistory(
            id: id,
            name: name,
            images: images,
            price: price,
            productId: productId,
            validFrom: DateTime.UtcNow,
            validTo: null, 
            description: description
        );
    }

    public static ProductHistory BuildNewProductHistoryFromProduct(Product product)
    {
        return BuildNewProductHistory(
            id: ProductHistoryId.ExecuteCreate(Guid.NewGuid()),
            name: product.Name,
            images: product.Images.Select(image => image.FileName.Value).ToList(),
            price: product.Price,
            productId: product.Id,
            description: product.Description
        );
    }
}