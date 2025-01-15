using Domain.Models;
using Domain.ValueObjects.Product;

namespace Domain.DomainFactories;

public class ProductFactory
{
    public static Product BuildExistingProduct(ProductId id, string name, decimal price, string description, DateTime dateCreated, List<ProductImage> images)
    {
        return new Product(
            id: id,
            dateCreated: dateCreated,
            name: name,
            price: price,
            description: description,
            images: images
        );
    }

    public static Product BuildNewProduct(ProductId id, string name, decimal price, string description, List<ProductImage> images)
    {
        return new Product(
            id: id,
            dateCreated: DateTime.UtcNow,
            name: name,
            price: price,
            description: description,
            images: images
        );
    }
}