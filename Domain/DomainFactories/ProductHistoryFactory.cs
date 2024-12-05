using Domain.Models;

namespace Domain.DomainFactories;

public class ProductHistoryFactory
{
    public static ProductHistory BuildExistingProductHistory(
        Guid id,
        string name,
        List<string> images,
        decimal price,
        Guid productId,
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
        Guid id,
        string name,
        List<string> images,
        decimal price,
        Guid productId,
        string description)
    {
        return new ProductHistory(
            id: id,
            name: name,
            images: images,
            price: price,
            productId: productId,
            validFrom: new DateTime(),
            validTo: null, 
            description: description
        );
    }

    public static ProductHistory BuildNewProductHistoryFromProduct(Product product)
    {
        return BuildNewProductHistory(
            id: Guid.NewGuid(),
            name: product.Name,
            images: product.Images.Select(image => image.FileName).ToList(),
            price: product.Price,
            productId: product.Id,
            description: product.Description
        );
    }
}