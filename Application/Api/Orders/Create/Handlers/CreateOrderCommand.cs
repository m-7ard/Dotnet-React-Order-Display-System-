using Application.Api.Orders.Create.Other;
using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Api.Orders.Create.Handlers;

public class CreateOrderCommand : IRequest<OneOf<CreateOrderResult, List<PlainApplicationError>>>
{
    public CreateOrderCommand(Dictionary<string, OrderItemData> orderItemData)
    {
        OrderItemData = orderItemData;
    }

    public Dictionary<string, OrderItemData> OrderItemData { get; set; }
}