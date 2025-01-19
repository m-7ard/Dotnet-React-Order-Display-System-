using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.DomainFactories;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.Product;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Create;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OneOf<CreateOrderResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductExistsValidator<ProductId> _productExistsValidator;
    private readonly ILatestProductHistoryExistsValidator<ProductId> _latestProductHistoryExistsValidator;
    private readonly ISequenceService _sequenceService;

    public CreateOrderHandler(IOrderRepository orderRepository, IProductExistsValidator<ProductId> productExistsValidator, ILatestProductHistoryExistsValidator<ProductId> latestProductHistoryExistsValidator, ISequenceService sequenceService)
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
            id: OrderId.ExecuteCreate(Guid.NewGuid()),
            total: 0,
            orderItems: [],
            status: OrderStatus.Pending,
            serialNumber: await _sequenceService.GetNextOrderValueAsync()
        );

        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            var productId = ProductId.ExecuteCreate(orderItem.ProductId);
            var productExistsResult = await _productExistsValidator.Validate(productId);
            if (productExistsResult.TryPickT1(out var errors, out var product))
            {
                validationErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [uid, ..error.Path])));
                continue;
            }

            var latestProductHistoryExistsResult = await _latestProductHistoryExistsValidator.Validate(ProductId.ExecuteCreate(orderItem.ProductId));
            if (latestProductHistoryExistsResult.TryPickT1(out errors, out var productHistory))
            {
                validationErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [uid, ..error.Path])));
                continue;
            }

            var canAddOrderItem = order.CanAddOrderItem(product, productHistory, quantity: orderItem.Quantity);
            if (canAddOrderItem.TryPickT1(out var error, out var _))
            {
                var applicationError = new ApplicationError(message: error, code: ApplicationValidatorErrorCodes.CAN_ADD_ORDER_ITEM_ERROR, path: [uid]);
                validationErrors.Add(applicationError);
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