using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Create;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OneOf<CreateOrderResult, List<ApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IOrderRepository _orderRepository;

    public CreateOrderHandler(IProductRepository productRepository, IProductHistoryRepository productHistoryRepository, IOrderRepository orderRepository)
    {
        _productRepository = productRepository;
        _productHistoryRepository = productHistoryRepository;
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<CreateOrderResult, List<ApplicationError>>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var errors = new List<ApplicationError>();
        var order = OrderFactory.BuildNewOrder(
            id: Guid.NewGuid(),
            total: 0,
            orderItems: [],
            status: OrderStatus.Pending
        );

        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            var validId = Guid.TryParse(orderItem.ProductId, out var parsedId);
            if (!validId)
            {
                errors.AddRange(
                    ApplicationErrorFactory.CreateSingleListError(
                        message: $"Invalid Product Id.",
                        path: ["orderItems", uid, "id"],
                        code: ApplicationErrorCodes.ModelDoesNotExist
                    )
                );
            }

            var product = await _productRepository.GetByIdAsync(parsedId);
            if (product is null)
            {
                errors.AddRange(
                    ApplicationErrorFactory.CreateSingleListError(
                        message: $"Product with Id \"{orderItem.ProductId}\" does not exist.",
                        path: ["orderItems", uid, "_"],
                        code: ApplicationErrorCodes.ModelDoesNotExist
                    )
                );
                continue;
            }

            var latestProductHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);
            if (latestProductHistory is null)
            {
                errors.Add(
                    new ApplicationError(
                        message: $"Product with Id \"{orderItem.ProductId}\" does not have a ProductHistory. All Products should have a ProductHistory when created and updated.",
                        path: ["orderItems", uid, "_"],
                        code: ApplicationErrorCodes.IntegrityError
                    )
                );
                
                continue;
            }

            var result = order.TryAddOrderItem(productHistory: latestProductHistory, quantity: orderItem.Quantity);
            if (result.TryPickT1(out var domainErrors, out var _))
            {
                var translated = ApplicationErrorFactory.DomainErrorsToApplicationErrors(domainErrors);
                errors.AddRange(translated.AsEnumerable());
            }
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        await _orderRepository.CreateAsync(order);
        return new CreateOrderResult(orderId: order.Id);
    }
}