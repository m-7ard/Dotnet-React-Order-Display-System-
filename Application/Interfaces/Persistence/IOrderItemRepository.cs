using Domain.Models;
using Domain.ValueObjects.OrderItem;

namespace Application.Interfaces.Persistence;

public interface IOrderItemRepository
{
    Task<OrderItem> CreateAsync(OrderItem order);
    Task<OrderItem?> GetByIdAsync(int id);
    Task<List<OrderItem>> FilterByOrderIdAsync(int id);
    Task<OrderItem> UpdateStatusAsync(int id, OrderItemStatus status);
}