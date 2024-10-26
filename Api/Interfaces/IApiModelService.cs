using Api.ApiModels;
using Domain.Models;

namespace Api.Interfaces;

public interface IApiModelService
{
    public Task<OrderApiModel> CreateOrderApiModel(Order order);
    public ProductApiModel CreateProductApiModel(Product order);
    public ProductHistoryApiModel CreateProductHistoryApiModel(ProductHistory productHistory);
}