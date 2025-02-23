using Domain.Models;
using OneOf;

namespace Application.Interfaces.Services;

public interface IProductHistoryDomainService
{
    Task<OneOf<ProductHistory, string>> GetLatestProductHistoryForProduct(Product product);
}