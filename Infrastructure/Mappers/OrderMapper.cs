using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.Shared;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class OrderMapper
{
    public static Order ToDomain(OrderDbEntity source)
    {
        return new Order(
            id: OrderId.ExecuteCreate(source.Id),
            total: Money.ExecuteCreate(source.Total),
            orderDates: OrderDates.ExecuteCreate(dateCreated: source.DateCreated, dateFinished: source.DateFinished),
            orderItems: source.OrderItems.Select(OrderItemMapper.ToDomain).ToList(),
            status: OrderStatus.ExecuteCreate(source.Status.ToString()),
            serialNumber: source.SerialNumber
        );
    }

    public static OrderDbEntity ToDbModel(Order source)
    {
        return new OrderDbEntity(
            id: source.Id.Value,
            total: source.Total.Value,
            dateCreated: source.OrderDates.DateCreated,
            dateFinished: source.OrderDates.DateFinished,
            status: ToDbEntityStatus(source.Status),
            serialNumber: source.SerialNumber
        );
    }

    public static OrderDbEntity.Statuses ToDbEntityStatus(OrderStatus status)
    {
        return (OrderDbEntity.Statuses)Enum.Parse(typeof(OrderDbEntity.Statuses), status.Name);
    }
}