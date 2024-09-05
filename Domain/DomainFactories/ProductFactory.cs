using Domain.Models;

namespace Domain.DomainFactories;

public class ProductFactory
{
    public static Product BuildExistingProduct(int id, string name, float price, string description, DateTime dateCreated, List<ProductImage> images)
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

    public static Product BuildNewProduct(string name, float price, string description, List<ProductImage> images)
    {
        return new Product(
            id: 0,
            dateCreated: new DateTime(),
            name: name,
            price: price,
            description: description,
            images: images
        );
    }
}