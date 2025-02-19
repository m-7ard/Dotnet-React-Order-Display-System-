
using Domain.Contracts.Orders;
using Domain.Contracts.Products;
using Domain.DomainService;
using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;
using Domain.ValueObjects.ProductImage;
using Domain.ValueObjects.Shared;

namespace Tests.UnitTests;

public class Mixins
{
    public static ProductHistory CreateProductHistory(int seed)
    {
        return new ProductHistory(
            id: ProductHistoryId.ExecuteCreate(Guid.NewGuid()),
            name: $"Product History {seed}",
            images: [],
            price: Money.ExecuteCreate(seed),
            productId: ProductId.ExecuteCreate(Guid.NewGuid()),
            validityRange: ProductHistoryValidityRange.ExecuteCreate(
                validFrom: new DateTime(),
                validTo: new DateTime().AddSeconds(1)
            ),
            description: $"Product History {seed} description"
        );
    }

    public static Product CreateProduct(int seed, List<ProductImage> images)
    {
        var contract = new CreateProductContract(
            id: Guid.NewGuid(),
            dateCreated: new DateTime(),
            name: $"Product #{seed}",
            price: seed,
            description: $"Product #{seed} description",
            images: images,
            amount: 1_000_000
        );

        return Product.ExecuteCreate(contract);
    }

    public static ProductImage CreateProductImage(int seed)
    {
        return new ProductImage(
            id: ProductImageId.ExecuteCreate(Guid.NewGuid()),
            fileName: FileName.ExecuteCreate($"filename_{seed}.png"),
            originalFileName: FileName.ExecuteCreate($"original filename_{seed}.png"),
            url: $"url_{seed}.png",
            dateCreated: new DateTime(),
            productId: ProductId.ExecuteCreate(Guid.NewGuid())
        );
    }

    public static Order CreateNewOrderWithItem(int seed, Product product, ProductHistory productHistory)
    {
        var order = OrderDomainService.ExecuteCreateNewOrder(id: Guid.NewGuid(), serialNumber: 1);
        OrderDomainService.ExecuteAddNewOrderItem(new AddNewOrderItemContract(
            order: order,
            id: Guid.NewGuid(),
            product: product,
            productHistory: productHistory,
            quantity: 1,
            serialNumber: seed
        ));

        return order;
    }
}