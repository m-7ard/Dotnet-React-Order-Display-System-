using Domain.Models;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class ProductHistoryMapper
{
    public static ProductHistory ToDomain(ProductHistoryDbEntity source)
    {
        return new ProductHistory(
            id: source.Id,
            name: source.Name,
            images: source.Images,
            price: source.Price,
            productId: source.ProductId,
            validFrom: source.ValidFrom,
            validTo: source.ValidTo,
            description: source.Description
        );
    }

    public static ProductHistoryDbEntity ToDbModel(ProductHistory source)
    {
        return new ProductHistoryDbEntity(
            id: source.Id,
            name: source.Name,
            images: source.Images,
            description: source.Description,
            price: source.Price,
            productId: source.ProductId,
            validFrom: source.ValidFrom,
            validTo: source.ValidTo
        );
    }
}