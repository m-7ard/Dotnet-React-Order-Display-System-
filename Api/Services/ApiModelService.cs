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

            var orderItemApiModel = ApiModelMapper.OrderItemToApiModel(
                orderItem: orderItem,
                productHistory: value.ProductHistory
            );

            orderItems.Add(orderItemApiModel);
        }

        var orderApiModel = ApiModelMapper.OrderToApiModel(order: order, orderItems: orderItems);
        return orderApiModel;
    }
}