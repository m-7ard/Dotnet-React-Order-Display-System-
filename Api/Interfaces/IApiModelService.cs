using Api.ApiModels;
using Application.Errors;
using Domain.Models;
using OneOf;

namespace Api.Interfaces;

public interface IApiModelService
{
    public Task<OneOf<OrderApiModel, List<ApplicationError>>> TryCreateOrderApiModel(Order order);
    public ProductApiModel CreateProductApiModel(Product order);
    public ProductHistoryApiModel CreateProductHistoryApiModel(ProductHistory productHistory);
}