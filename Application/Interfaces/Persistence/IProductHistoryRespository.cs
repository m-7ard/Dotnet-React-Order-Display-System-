using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IProductHistoryRepository
{
    Task<ProductHistory> CreateAsync(ProductHistory productHistory);
    Task<ProductHistory?> GetLatestByProductIdAsync(int id);
    Task<ProductHistory?> GetByIdAsync(int id);
    Task<List<ProductHistory>> FindAllAsync(
        string? name,
        decimal? minPrice,
        decimal? maxPrice,
        string? description,
        DateTime? validFrom,
        DateTime? validTo,
        int? productId,
        Tuple<string, bool>? orderBy);
    Task UpdateAsync(ProductHistory productHistory);
}