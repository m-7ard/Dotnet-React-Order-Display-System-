using Api.ApiModels;
using Api.Interfaces;
using Api.Mappers;
using Application.Errors;
using Application.Handlers.ProductHistories.Read;
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
                productHistory: ApiModelMapper.ProductHistoryToApiModel(value.ProductHistory)
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
}