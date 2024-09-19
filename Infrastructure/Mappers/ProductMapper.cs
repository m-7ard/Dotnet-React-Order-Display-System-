using Application.ApiModels;
using Domain.Models;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class ProductMapper
{
    public static ProductDbEntity DomainToDbEntity(Product domain)
    {
        return new ProductDbEntity(
            id: domain.Id, 
            dateCreated: domain.DateCreated, 
            name: domain.Name,
            description: domain.Description,
            price: domain.Price
        ) {
            Images = domain.Images.Select(ProductImageMapper.ToDbModel).ToList()
        };
    }

    public static Product DbEntityToDomain(ProductDbEntity dbEntity)
    {
        return new Product(
            id: dbEntity.Id, 
            name: dbEntity.Name,
            price: dbEntity.Price,
            description: dbEntity.Description,
            dateCreated: dbEntity.DateCreated,
            images: dbEntity.Images.Select(ProductImageMapper.ToDomain).ToList()
        );
    }
}