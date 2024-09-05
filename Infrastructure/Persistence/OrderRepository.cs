using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.Order;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class OrderRepository : IOrderRepository
{
    private readonly SimpleProductOrderServiceDbContext _simpleProductOrderServiceDbContext;

    public OrderRepository(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _simpleProductOrderServiceDbContext = simpleProductOrderServiceDbContext;
    }

    public async Task<Order> CreateAsync(Order order)
    {
        var orderDbEntity = OrderMapper.ToDbModel(order);
        _simpleProductOrderServiceDbContext.Add(orderDbEntity);
        await _simpleProductOrderServiceDbContext.SaveChangesAsync();
        return OrderMapper.ToDomain(orderDbEntity);
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        var orderDbEntity = await _simpleProductOrderServiceDbContext.Order.SingleOrDefaultAsync(d => d.Id == id);
        return orderDbEntity is null ? null : OrderMapper.ToDomain(orderDbEntity);
    }

    public async Task<Order> UpdateStatusAsync(int id, OrderStatus status)
    {
        var orderDbEntity = await _simpleProductOrderServiceDbContext.Order.SingleAsync(d => d.Id == id);
        var orderDomainEntity = OrderMapper.ToDomain(orderDbEntity);

        var updatedOrderdbEntity = OrderMapper.ToDbModel(orderDomainEntity);
        
        _simpleProductOrderServiceDbContext.Entry(orderDbEntity).CurrentValues.SetValues(updatedOrderdbEntity);
        await _simpleProductOrderServiceDbContext.SaveChangesAsync();

        return OrderMapper.ToDomain(orderDbEntity);
    }
}