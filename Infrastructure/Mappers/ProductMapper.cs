using Domain.Models;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class ProductMapper
{
    public static ProductDbEntity ToDbEntity(Product domain)
    {
        return new ProductDbEntity(
            id: domain.Id, 
            dateCreated: domain.DateCreated, 
            name: domain.Name
        );
    }

    public static Product ToDomain(ProductDbEntity dbEntity)
    {
        return new Product(
            id: dbEntity.Id, 
            dateCreated: dbEntity.DateCreated, 
            name: dbEntity.Name
        );
    }
}