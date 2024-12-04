using Domain.Models;
using Domain.ValueObjects.Order;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class OrderMapper
{
    public static Order ToDomain(OrderDbEntity source)
    {
        return new Order(
            id: source.Id,
            total: source.Total,
            dateCreated: source.DateCreated,
            dateFinished: source.DateFinished,
            orderItems: source.OrderItems.Select(OrderItemMapper.ToDomain).ToList(),
            status: new OrderStatus(source.Status.ToString()),
            serialNumber: source.SerialNumber
        );
    }

    public static OrderDbEntity ToDbModel(Order source)
    {
        return new OrderDbEntity(
            id: source.Id,
            total: source.Total,
            dateCreated: source.DateCreated,
            dateFinished: source.DateFinished,
            status: ToDbEntityStatus(source.Status),
            serialNumber: source.SerialNumber
        )
        {
            OrderItems = source.OrderItems.Select(OrderItemMapper.ToDbModel).ToList()
        };
    }

    public static OrderDbEntity.Statuses ToDbEntityStatus(OrderStatus status)
    {
        return (OrderDbEntity.Statuses)Enum.Parse(typeof(OrderDbEntity.Statuses), status.Name);
    }
}