using Domain.Models;

namespace Domain.DomainFactories;

public class ProductFactory
{
    public static Product BuildExistingProduct(int id, DateTime dateCreated, string name)
    {
        return new Product(
            id: id,
            dateCreated: dateCreated,
            name: name
        );
    }

    public static Product BuildNewProduct(string name)
    {
        return new Product(
            id: 0,
            dateCreated: new DateTime(),
            name: name
        );
    }
}