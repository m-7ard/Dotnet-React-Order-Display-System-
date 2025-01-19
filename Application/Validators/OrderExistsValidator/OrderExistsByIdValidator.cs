using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.Order;
using OneOf;

namespace Application.Validators.OrderExistsValidator;

public class OrderExistsByIdValidator : IOrderExistsValidator<OrderId>
{
    private readonly IOrderRepository _orderRepository;

    public OrderExistsByIdValidator(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<Order, List<ApplicationError>>> Validate(OrderId id)
    {
        var order = await _orderRepository.GetByIdAsync(id);

        if (order is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Order of Id \"{id}\" does not exist.",
                code: SpecificApplicationErrorCodes.ORDER_EXISTS_ERROR,
                path: []
            );
        }

        return order;
    }
}