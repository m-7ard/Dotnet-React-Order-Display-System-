
using Application.ApiModels;
using Domain.Models;

namespace Application.Interfaces.Services;

public interface IApiModelService
{
    public Task<OrderApiModel> CreateOrderApiModel(Order order);
    public ProductApiModel CreateProductApiModel(Product order);
    public ProductHistoryApiModel CreateProductHistoryApiModel(ProductHistory productHistory);
}