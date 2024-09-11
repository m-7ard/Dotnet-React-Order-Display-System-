using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.Order;
using Infrastructure.DbEntities;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class OrderRepository : IOrderRepository
{
    private readonly SimpleProductOrderServiceDbContext _dbContext;

    public OrderRepository(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext)
    {
        _dbContext = simpleProductOrderServiceDbContext;
    }

    public async Task<Order> CreateAsync(Order order)
    {
        var orderDbEntity = OrderMapper.ToDbModel(order);
        _dbContext.Add(orderDbEntity);
        await _dbContext.SaveChangesAsync();
        return OrderMapper.ToDomain(orderDbEntity);
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        var orderDbEntity = await _dbContext.Order.SingleOrDefaultAsync(d => d.Id == id);
        return orderDbEntity is null ? null : OrderMapper.ToDomain(orderDbEntity);
    }

    public async Task<Order> UpdateStatusAsync(int id, OrderStatus status)
    {
        var orderDbEntity = await _dbContext.Order.SingleAsync(d => d.Id == id);
        var orderDomainEntity = OrderMapper.ToDomain(orderDbEntity);

        var updatedOrderdbEntity = OrderMapper.ToDbModel(orderDomainEntity);
        
        _dbContext.Entry(orderDbEntity).CurrentValues.SetValues(updatedOrderdbEntity);
        await _dbContext.SaveChangesAsync();

        return OrderMapper.ToDomain(orderDbEntity);
    }

    public async Task<List<Order>> FindAllAsync(float? minTotal, float? maxTotal, OrderStatus? status, DateTime? createdBefore, DateTime? createdAfter)
    {
        IQueryable<OrderDbEntity> query = _dbContext.Order.Include(d => d.OrderItems).ThenInclude(d => d.ProductHistory);

        if (minTotal.HasValue)
        {
            query = query.Where(item => item.Total >= minTotal.Value);
        }

        if (maxTotal.HasValue)
        {
            query = query.Where(item => item.Total <= maxTotal.Value);
        }

        if (createdAfter.HasValue)
        {
            query = query.Where(item => item.DateCreated >= createdAfter);
        }

        if (createdBefore.HasValue)
        {
            query = query.Where(item => item.DateCreated <= createdBefore);
        }

        if (status is not null)
        {
            query = query.Where(item => item.Status == OrderMapper.ToDbEntityStatus(status));
        }

        var dbOrders = await query.ToListAsync();
        return dbOrders.Select(OrderMapper.ToDomain).ToList();
    }
}