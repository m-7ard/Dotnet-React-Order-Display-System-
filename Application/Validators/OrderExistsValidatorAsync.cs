using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.Models;
using OneOf;

namespace Application.Validators;

public class OrderExistsValidatorAsync : IValidatorAsync<Guid, Order>
{
    private readonly IOrderRepository _orderRepository;

    public OrderExistsValidatorAsync(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<Order, List<ApplicationError>>> Validate(Guid input)
    {
     var order = await _orderRepository.GetByIdAsync(input);

        if (order is null)
        {
            return ApplicationErrorFactory.CreateSingleListError(
                message: $"Order of Id \"{input}\" does not exist.",
                code: ApplicationValidatorErrorCodes.ORDER_EXISTS_ERROR,
                path: []
            );
        }

        return order;
    }
}