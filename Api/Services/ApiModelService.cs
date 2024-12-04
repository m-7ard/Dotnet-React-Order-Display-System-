using Api.ApiModels;
using Api.Errors;
using Api.Interfaces;
using Application.Errors;
using Application.Handlers.ProductHistories.Read;
using Application.Interfaces.Persistence;
using Domain.Models;
using MediatR;
using OneOf;

namespace Api.Services;

public class ApiModelService : IApiModelService
{
    private readonly ISender _mediator;

    public ApiModelService(ISender mediator)
    {
        _mediator = mediator;
    }

    public async Task<OneOf<OrderApiModel, List<ApplicationError>>> TryCreateOrderApiModel(Order order)
    {
        var orderItems = new List<OrderItemApiModel>();

        foreach (var orderItem in order.OrderItems)
        {
            var query = new ReadProductHistoryQuery(orderItem.ProductHistoryId);
            var result = await _mediator.Send(query);
            if (result.TryPickT1(out var errors, out var value))
            {
                return errors;
            }

            var orderItemApiModel = new OrderItemApiModel(
                id: orderItem.Id.ToString(),
                quantity: orderItem.Quantity,
                status: orderItem.Status.Name,
                dateCreated: orderItem.DateCreated,
                dateFinished: orderItem.DateFinished,
                orderId: order.Id.ToString(),
                productHistory: CreateProductHistoryApiModel(value.ProductHistory)
            );

            orderItems.Add(orderItemApiModel);
        }

        var orderApiModel = new OrderApiModel(
            id: order.Id.ToString(),
            total: order.Total,
            dateCreated: order.DateCreated,
            dateFinished: order.DateFinished,
            orderItems: orderItems,
            status: order.Status.Name
        );

        return orderApiModel;
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