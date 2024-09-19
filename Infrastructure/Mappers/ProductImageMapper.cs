using Domain.Models;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class ProductImageMapper
{
    public static ProductImage ToDomain(ProductImageDbEntity source)
    {
        return new ProductImage(
            id: source.Id,
            fileName: source.FileName,
            originalFileName: source.OriginalFileName,
            dateCreated: source.DateCreated,
            productId: source.ProductId,
            url: source.Url
        );
    }

    public static ProductImageDbEntity ToDbModel(ProductImage source)
    {
        return new ProductImageDbEntity(
            id: source.Id,
            fileName: source.FileName,
            originalFileName: source.OriginalFileName,
            dateCreated: source.DateCreated,
            productId: source.ProductId,
            url: source.Url
        );
    }
}