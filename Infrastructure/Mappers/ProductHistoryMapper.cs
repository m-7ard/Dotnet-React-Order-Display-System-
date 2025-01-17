using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class ProductHistoryMapper
{
    public static ProductHistory ToDomain(ProductHistoryDbEntity source)
    {
        return new ProductHistory(
            id: ProductHistoryId.ExecuteCreate(source.Id),
            name: source.Name,
            images: source.Images,
            price: source.Price,
            productId: ProductId.ExecuteCreate(source.OriginalProductId),
            validFrom: source.ValidFrom,
            validTo: source.ValidTo,
            description: source.Description
        );
    }

    public static ProductHistoryDbEntity ToDbModel(ProductHistory source)
    {
        return new ProductHistoryDbEntity(
            id: source.Id.Value,
            name: source.Name,
            images: source.Images,
            description: source.Description,
            price: source.Price,
            productId: source.ProductId.Value,
            originalProductId: source.ProductId.Value,
            validFrom: source.ValidFrom,
            validTo: source.ValidTo
        );
    }
}