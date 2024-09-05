using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.OrderItem;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class OrderItemRepository : IOrderItemRepository
{
    private readonly SimpleProductOrderServiceDbContext _simpleProductOrderServiceDbContext;

    public OrderItemRepository(SimpleProductOrderServiceDbContext simpleProductOrderItemServiceDbContext)
    {
        _simpleProductOrderServiceDbContext = simpleProductOrderItemServiceDbContext;
    }

    public async Task<OrderItem> CreateAsync(OrderItem orderItem)
    {
        var orderItemDbEntity = OrderItemMapper.ToDbModel(orderItem);
        _simpleProductOrderServiceDbContext.Add(orderItemDbEntity);
        await _simpleProductOrderServiceDbContext.SaveChangesAsync();
        return OrderItemMapper.ToDomain(orderItemDbEntity);
    }

    public async Task<OrderItem?> GetByIdAsync(int id)
    {
        var orderItemDbEntity = await _simpleProductOrderServiceDbContext.OrderItem.SingleOrDefaultAsync(d => d.Id == id);
        return orderItemDbEntity is null ? null : OrderItemMapper.ToDomain(orderItemDbEntity);
    }

    public async Task<OrderItem> UpdateStatusAsync(int id, OrderItemStatus status)
    {
        var orderItemDbEntity = await _simpleProductOrderServiceDbContext.OrderItem.SingleAsync(d => d.Id == id);
        var orderItemDomainEntity = OrderItemMapper.ToDomain(orderItemDbEntity);

        var updatedOrderItemdbEntity = OrderItemMapper.ToDbModel(orderItemDomainEntity);
        
        _simpleProductOrderServiceDbContext.Entry(orderItemDbEntity).CurrentValues.SetValues(updatedOrderItemdbEntity);
        await _simpleProductOrderServiceDbContext.SaveChangesAsync();

        return OrderItemMapper.ToDomain(orderItemDbEntity);
    }
}