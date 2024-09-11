using Domain.Models;
using Domain.ValueObjects.Order;

namespace Application.Interfaces.Persistence;

public interface IOrderRepository
{
    Task<Order> CreateAsync(Order order);
    Task<Order?> GetByIdAsync(int id);
    Task<Order> UpdateStatusAsync(int id, OrderStatus status);
    Task<List<Order>> FindAllAsync(float? minTotal, float? maxTotal, OrderStatus? status, DateTime? createdBefore, DateTime? createdAfter);

}