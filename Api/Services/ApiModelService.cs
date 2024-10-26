using Api.ApiModels;
using Api.Interfaces;
using Application.Interfaces.Persistence;
using Domain.Models;

namespace Api.Services;

public class ApiModelService : IApiModelService
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ApiModelService(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OrderApiModel> CreateOrderApiModel(Order order)
    {
        var orderItems = new List<OrderItemApiModel>();
        foreach (var orderItem in order.OrderItems)
        {
            var productHistory = await _productHistoryRepository.GetByIdAsync(orderItem.ProductHistoryId);
            if (productHistory is null)
            {
                throw new Exception($"ProductHistory of Id \"{orderItem.ProductHistoryId}\" does not exist.");
            }

            var orderItemApiModel = new OrderItemApiModel(
                id: orderItem.Id,
                quantity: orderItem.Quantity,
                status: orderItem.Status.Name,
                dateCreated: orderItem.DateCreated,
                dateFinished: orderItem.DateFinished,
                orderId: order.Id,
                productHistory: CreateProductHistoryApiModel(productHistory)
            );

            orderItems.Add(orderItemApiModel);
        }

        var apiModel = new OrderApiModel(
            id: order.Id,
            total: order.Total,
            dateCreated: order.DateCreated,
            dateFinished: order.DateFinished,
            orderItems: orderItems,
            status: order.Status.Name
        );

        return apiModel;
    }

    public ProductApiModel CreateProductApiModel(Product product)
    {
        var productApiModel = new ProductApiModel(
            id: product.Id,
            name: product.Name,
            price: product.Price,
            description: product.Description,
            dateCreated: product.DateCreated,
            images: product.Images.Select(d => new ImageApiModel(
                fileName: d.FileName,
                originalFileName: d.OriginalFileName,
                url: d.Url
            )).ToList()
        );

        return productApiModel;
    }

    public ProductHistoryApiModel CreateProductHistoryApiModel(ProductHistory productHistory)
    {
        return new ProductHistoryApiModel(
            id: productHistory.Id,
            name: productHistory.Name,
            images: productHistory.Images,
            description: productHistory.Description,
            price: productHistory.Price,
            productId: productHistory.ProductId,
            validFrom: productHistory.ValidFrom,
            validTo: productHistory.ValidTo
        );
    }
}