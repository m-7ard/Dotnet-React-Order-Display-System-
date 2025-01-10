using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using Domain.DomainFactories;
using Domain.ValueObjects.Order;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Create;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OneOf<CreateOrderResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ProductExistsValidatorAsync _productExistsValidator;
    private readonly LatestProductHistoryExistsValidatorAsync _latestProductHistoryExistsValidator;
    private readonly ISequenceService _sequenceService;

    public CreateOrderHandler(IOrderRepository orderRepository, ProductExistsValidatorAsync productExistsValidator, LatestProductHistoryExistsValidatorAsync latestProductHistoryExistsValidator, ISequenceService sequenceService)
    {
        _orderRepository = orderRepository;
        _productExistsValidator = productExistsValidator;
        _latestProductHistoryExistsValidator = latestProductHistoryExistsValidator;
        _sequenceService = sequenceService;
    }

    public async Task<OneOf<CreateOrderResult, List<ApplicationError>>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var validationErrors = new List<ApplicationError>();
        var order = OrderFactory.BuildNewOrder(
            id: Guid.NewGuid(),
            total: 0,
            orderItems: [],
            status: OrderStatus.Pending,
            serialNumber: await _sequenceService.GetNextOrderValueAsync()
        );

        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            var productExistsResult = await _productExistsValidator.Validate(orderItem.ProductId);
            if (productExistsResult.TryPickT1(out var errors, out var product))
            {
                validationErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [uid, ..error.Path])));
                continue;
            }

            var latestProductHistoryExistsResult = await _latestProductHistoryExistsValidator.Validate(orderItem.ProductId);
            if (latestProductHistoryExistsResult.TryPickT1(out errors, out var productHistory))
            {
                validationErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [uid, ..error.Path])));
                continue;
            }

            var canAddOrderItem = new CanAddOrderItemValidator(order);
            var canAddOrderItemResult = canAddOrderItem.Validate(new CanAddOrderItemValidator.Input(product: product, productHistory: productHistory, quantity: orderItem.Quantity));
            if (canAddOrderItemResult.TryPickT1(out errors, out var _))
            {
                validationErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [uid, ..error.Path])));
                continue;
            }

            order.ExecuteAddOrderItem(product: product, productHistory: productHistory, quantity: orderItem.Quantity, serialNumber: await _sequenceService.GetNextOrderItemValueAsync());
        }

        if (validationErrors.Count > 0)
        {
            return validationErrors;
        }

        await _orderRepository.CreateAsync(order);
        return new CreateOrderResult(orderId: order.Id);
    }
}