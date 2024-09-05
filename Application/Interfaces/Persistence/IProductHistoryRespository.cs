using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IProductHistoryRepository
{
    Task<ProductHistory> CreateAsync(ProductHistory productHistory);
    Task<ProductHistory?> GetLatestByProductIdAsync(int id);
}