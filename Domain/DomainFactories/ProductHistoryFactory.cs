using Domain.Models;

namespace Domain.DomainFactories;

public class ProductHistoryFactory
{
    public static ProductHistory BuildExistingProductHistory(
        int id,
        string name,
        List<string> images,
        decimal price,
        int productId,
        DateTime validFrom,
        DateTime validTo,
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
        string name,
        List<string> images,
        decimal price,
        int productId,
        string description)
    {
        return new ProductHistory(
            id: 0,
            name: name,
            images: images,
            price: price,
            productId: productId,
            validFrom: new DateTime(),
            validTo: new DateTime(), 
            description: description
        );
    }

        public static ProductHistory BuildNewProductHistoryFromProduct(Product product)
    {
        return BuildNewProductHistory(
            name: product.Name,
            images: product.Images.Select(image => image.FileName).ToList(),
            price: product.Price,
            productId: product.Id,
            description: product.Description
        );
    }
}