using Domain.Models;
using OneOf;

namespace Application.Interfaces.Services;

public interface IProductDomainService
{
    Task<OneOf<Product, string>> GetProductById(Guid id);
}