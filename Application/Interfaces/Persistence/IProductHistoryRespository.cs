using Application.Contracts.Criteria;
using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IProductHistoryRepository
{
    Task<ProductHistory> CreateAsync(ProductHistory productHistory);
    Task<ProductHistory?> GetLatestByProductIdAsync(Guid id);
    Task<ProductHistory?> GetByIdAsync(Guid id);
    Task<List<ProductHistory>> FindAllAsync(FilterProductHistoriesCriteria criteria);
    Task UpdateAsync(ProductHistory productHistory);
}