using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;
using Domain.ValueObjects.Shared;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class OrderItemMapper
{
    public static OrderItem ToDomain(OrderItemDbEntity source)
    {
        return new OrderItem(
            id: OrderItemId.ExecuteCreate(source.Id),
            quantity: Quantity.ExecuteCreate(source.Quantity),
            status: new OrderItemStatus(source.Status.ToString()),
            orderItemDates: OrderItemDates.ExecuteCreate(
                dateCreated: source.DateCreated,
                dateFinished: source.DateFinished
            ),
            orderId: OrderId.ExecuteCreate(source.OrderId),
            productHistoryId: ProductHistoryId.ExecuteCreate(source.ProductHistoryId),
            productId: ProductId.ExecuteCreate(source.ProductId),
            serialNumber: source.SerialNumber
        );
    }

    public static OrderItemDbEntity ToDbModel(OrderItem source)
    {
        return new OrderItemDbEntity(
            id: source.Id.Value,
            quantity: source.Quantity.Value,
            status: ToDbEntityStatus(source.Status),
            dateCreated: source.OrderItemDates.DateCreated,
            dateFinished: source.OrderItemDates.DateFinished,
            orderId: source.OrderId.Value,
            productHistoryId: source.ProductHistoryId.Value,
            productId: source.ProductId.Value,
            serialNumber: source.SerialNumber
        );
    }

    public static OrderItemDbEntity.Statuses ToDbEntityStatus(OrderItemStatus status)
    {
        return (OrderItemDbEntity.Statuses)Enum.Parse(typeof(OrderItemDbEntity.Statuses), status.Name);
    }
}