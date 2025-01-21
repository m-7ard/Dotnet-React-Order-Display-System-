using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.Shared;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class ProductMapper
{
    public static ProductDbEntity FromDomainToDbEntity(Product domain)
    {
        return new ProductDbEntity(
            id: domain.Id.Value, 
            dateCreated: domain.DateCreated, 
            name: domain.Name,
            description: domain.Description,
            price: domain.Price.Value
        ) {
            Images = domain.Images.Select(ProductImageMapper.ToDbModel).ToList()
        };
    }

    public static Product FromDbEntityToDomain(ProductDbEntity dbEntity)
    {
        return new Product(
            id: ProductId.ExecuteCreate(dbEntity.Id), 
            name: dbEntity.Name,
            price: Money.ExecuteCreate(dbEntity.Price),
            description: dbEntity.Description,
            dateCreated: dbEntity.DateCreated,
            images: dbEntity.Images.Select(ProductImageMapper.ToDomain).ToList()
        );
    }
}