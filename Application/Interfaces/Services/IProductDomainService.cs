using Application.Contracts.DomainService.ProductDomainService;
using Domain.Models;
using OneOf;

namespace Application.Interfaces.Services;

public interface IProductDomainService
{
    Task<OneOf<Product, string>> GetProductById(Guid id);
    OneOf<Product, string> TryOrchestrateCreateProduct(OrchestrateCreateNewProductContract contract);
    Task<OneOf<bool, string>> TryOrchestrateAddNewProductImage(Product product, string fileName);
}