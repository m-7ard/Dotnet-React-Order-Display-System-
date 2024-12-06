using Application.Contracts.Criteria;
using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IOrderRepository
{
    Task CreateAsync(Order order);
    Task<Order?> GetByIdAsync(Guid id);
    Task<List<Order>> FilterAllAsync(FilterOrdersCriteria criteria);
    Task UpdateAsync(Order order);
}