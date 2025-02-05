using Application.Contracts.Criteria;
using Application.Interfaces.Persistence;
using Domain.DomainEvents.Order;
using Domain.Models;
using Domain.ValueObjects.Order;
using Infrastructure.DbEntities;
using Infrastructure.Interfaces;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class OrderRepository : IOrderRepository
{
    private readonly SimpleProductOrderServiceDbContext _dbContext;
    private readonly IOrderDbEntityQueryServiceFactory _orderDbEntityQueryServiceFactory;


    public OrderRepository(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext, IOrderDbEntityQueryServiceFactory orderDbEntityQueryServiceFactory)
    {
        _dbContext = simpleProductOrderServiceDbContext;
        _orderDbEntityQueryServiceFactory = orderDbEntityQueryServiceFactory;
    }

    public async Task CreateAsync(Order order)
    {
        var orderDbEntity = OrderMapper.ToDbModel(order);
        _dbContext.Add(orderDbEntity);

        var orderItemDbEntities = order.OrderItems.Select(OrderItemMapper.ToDbModel);
        foreach (var orderItemDbEntity in orderItemDbEntities)
        {
            _dbContext.Add(orderItemDbEntity);
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task<Order?> GetByIdAsync(OrderId id)
    {
        var orderDbEntity = await _dbContext.Order
            .Include(d => d.OrderItems)
            .SingleOrDefaultAsync(d => d.Id == id.Value);
            
        return orderDbEntity is null ? null : OrderMapper.ToDomain(orderDbEntity);
    }

    public async Task<List<Order>> FilterAllAsync(FilterOrdersCriteria criteria)
    {
        IQueryable<OrderDbEntity> query = _dbContext.Order.Include(d => d.OrderItems);

        if (criteria.Id is not null)
        {
            query = query.Where(order => order.Id == criteria.Id);
        }

        if (criteria.MinTotal is not null)
        {
            query = query.Where(order => order.Total >= criteria.MinTotal);
        }

        if (criteria.MaxTotal is not null)
        {
            query = query.Where(order => order.Total <= criteria.MaxTotal);
        }

        if (criteria.CreatedAfter is not null)
        {
            query = query.Where(order => order.DateCreated >= criteria.CreatedAfter);
        }

        if (criteria.CreatedBefore is not null)
        {
            query = query.Where(order => order.DateCreated <= criteria.CreatedBefore);
        }

        if (criteria.Status is not null)
        {
            query = query.Where(order => order.Status == OrderMapper.ToDbEntityStatus(criteria.Status));
        }

        if (criteria.ProductId is not null)
        {
            query = query.Where(order => order.OrderItems.Any(item => item.ProductId == criteria.ProductId));
        }

        if (criteria.ProductHistoryId is not null)
        {
            query = query.Where(order => order.OrderItems.Any(item => item.ProductHistoryId == criteria.ProductHistoryId));
        }

        
        if (criteria.OrderSerialNumber is not null)
        {
            query = query.Where(order => order.SerialNumber == criteria.OrderSerialNumber.Value);
        }

        if (criteria.OrderItemSerialNumber is not null)
        {
            query = query.Where(order => order.OrderItems.Any(item => item.SerialNumber == criteria.OrderItemSerialNumber));
        }

        var queryService = _orderDbEntityQueryServiceFactory.Create(query);

        if (criteria.OrderBy is not null)
        {
            queryService.ApplyOrderBy(criteria.OrderBy);
        }

        var dbOrders = await queryService.ReturnResult();
        return dbOrders.Select(OrderMapper.ToDomain).ToList();
    }

    public async Task UpdateAsync(Order updatedOrder) 
    {
        var updatedOrderEntity = OrderMapper.ToDbModel(updatedOrder);
        var currentOrderEntity = await _dbContext.Order.SingleAsync(d => d.Id == updatedOrder.Id.Value);
        _dbContext.Entry(currentOrderEntity).CurrentValues.SetValues(updatedOrderEntity);

        foreach (var domainEvent in updatedOrder.DomainEvents)
        {
            if (domainEvent is OrderItemPendingUpdatingEvent updateEvent)
            {
                var payload = updateEvent.Payload;
                var orderItemDbEntity = await _dbContext.OrderItem.SingleAsync(orderItem => orderItem.Id == payload.Id.Value);
                _dbContext.Entry(orderItemDbEntity).CurrentValues.SetValues(OrderItemMapper.ToDbModel(payload));
            }
        }
        
        await _dbContext.SaveChangesAsync();
        updatedOrder.ClearEvents();
    }
}