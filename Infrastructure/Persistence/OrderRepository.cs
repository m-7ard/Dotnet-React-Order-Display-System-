using System.Linq.Expressions;
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
        var orderDbEntity = await _dbContext.Order
            .Include(d => d.OrderItems)
            .SingleOrDefaultAsync(d => d.Id == id);
            
        return orderDbEntity is null ? null : OrderMapper.ToDomain(orderDbEntity);
    }

    public async Task<List<Order>> FindAllAsync(
        decimal? minTotal, 
        decimal? maxTotal, 
        OrderStatus? status, 
        DateTime? createdBefore, 
        DateTime? createdAfter, 
        int? productId, 
        int? id, 
        int? productHistoryId,
        Tuple<string, bool>? orderBy)
    {
        IQueryable<OrderDbEntity> query = _dbContext.Order.Include(d => d.OrderItems);

        if (id is not null)
        {
            query = query.Where(order => order.Id == id);
        }

        if (minTotal is not null)
        {
            query = query.Where(order => order.Total >= minTotal);
        }

        if (maxTotal is not null)
        {
            query = query.Where(order => order.Total <= maxTotal);
        }

        if (createdAfter is not null)
        {
            query = query.Where(order => order.DateCreated >= createdAfter);
        }

        if (createdBefore is not null)
        {
            query = query.Where(order => order.DateCreated <= createdBefore);
        }

        if (status is not null)
        {
            query = query.Where(order => order.Status == OrderMapper.ToDbEntityStatus(status));
        }

        if (productId is not null)
        {
            query = query.Where(order => order.OrderItems.Any(item => item.ProductId == productId));
        }

        if (productHistoryId is not null)
        {
            query = query.Where(order => order.OrderItems.Any((item) => item.ProductHistoryId == productHistoryId));
        }

        if (orderBy is not null)
        {
            Dictionary<string, Expression<Func<OrderDbEntity, object>>> fieldMappings = new()
            {
                { "Total", p => p.Total },
                { "DateCreated", p => p.DateCreated },
            };

            if (fieldMappings.TryGetValue(orderBy.Item1, out var orderByExpression))
            {
                query = orderBy.Item2 ? query.OrderBy(orderByExpression) : query.OrderByDescending(orderByExpression);
            }
        }

        var dbOrders = await query.ToListAsync();
        return dbOrders.Select(OrderMapper.ToDomain).ToList();
    }

    public async Task UpdateAsync(Order updatedOrder) 
    {
        var updatedOrderEntity = OrderMapper.ToDbModel(updatedOrder);
        var currentOrderEntity = await _dbContext.Order.SingleAsync(d => d.Id == updatedOrder.Id);
        _dbContext.Entry(currentOrderEntity).CurrentValues.SetValues(updatedOrderEntity);

        foreach (var updatedItemEntity in updatedOrderEntity.OrderItems)
        {
            var currentOrderItemEntity = await _dbContext.OrderItem.SingleAsync(d => d.Id == updatedItemEntity.Id);
            _dbContext.Entry(currentOrderItemEntity).CurrentValues.SetValues(updatedItemEntity);
        }        
        
        await _dbContext.SaveChangesAsync();
    }
}