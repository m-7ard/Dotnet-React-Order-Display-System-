using Domain.Models;
using Domain.ValueObjects.OrderItem;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class OrderItemMapper
{
    public static OrderItem ToDomain(OrderItemDbEntity source)
    {
        return new OrderItem(
            id: source.Id,
            quantity: source.Quantity,
            status: new OrderItemStatus(source.Status.ToString()),
            dateCreated: source.DateCreated,
            dateFinished: source.DateFinished,
            orderId: source.OrderId,
            productHistoryId: source.ProductHistoryId,
            productId: source.ProductId
        );
    }

    public static OrderItemDbEntity ToDbModel(OrderItem source)
    {
        return new OrderItemDbEntity(
            id: source.Id,
            quantity: source.Quantity,
            status: ToDbEntityStatus(source.Status),
            dateCreated: source.DateCreated,
            dateFinished: source.DateFinished,
            orderId: source.OrderId,
            productHistoryId: source.ProductHistoryId,
            productId: source.ProductId
        );
    }

    public static OrderItemDbEntity.Statuses ToDbEntityStatus(OrderItemStatus status)
    {
        return (OrderItemDbEntity.Statuses)Enum.Parse(typeof(OrderItemDbEntity.Statuses), status.Name);
    }
}