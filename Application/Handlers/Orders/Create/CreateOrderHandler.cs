using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.Contracts.OrderItems;
using Domain.Contracts.Orders;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Product;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Create;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OneOf<CreateOrderResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductExistsValidator<ProductId> _productExistsValidator;
    private readonly IProductRepository _productRepository;
    private readonly ILatestProductHistoryExistsValidator<ProductId> _latestProductHistoryExistsValidator;
    private readonly ISequenceService _sequenceService;

    public CreateOrderHandler(IOrderRepository orderRepository, IProductExistsValidator<ProductId> productExistsValidator, ILatestProductHistoryExistsValidator<ProductId> latestProductHistoryExistsValidator, ISequenceService sequenceService, IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _productExistsValidator = productExistsValidator;
        _latestProductHistoryExistsValidator = latestProductHistoryExistsValidator;
        _sequenceService = sequenceService;
        _productRepository = productRepository;
    }

    public async Task<OneOf<CreateOrderResult, List<ApplicationError>>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var validationErrors = new List<ApplicationError>();
        var order = OrderFactory.BuildNewOrder(
            id: OrderId.ExecuteCreate(Guid.NewGuid()),
            status: OrderStatus.Pending,
            serialNumber: await _sequenceService.GetNextOrderValueAsync()
        );

        var updatedProducts = new List<Product>();

        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            var canCreateProductId = ProductId.TryCreate(orderItem.ProductId);
            if (canCreateProductId.TryPickT1(out var error, out var productId))
            {
                validationErrors.Add(new NotAllowedError(message: error, path: [uid]));
                continue;
            }

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
            
            var contract = new AddOrderItemContract(
                id: Guid.NewGuid(), 
                product: product, 
                productHistory: productHistory, 
                quantity: orderItem.Quantity, 
                serialNumber: await _sequenceService.GetNextOrderItemValueAsync(),
                status: OrderItemStatus.Pending.Name,
                dateCreated: DateTime.UtcNow,
                dateFinished: null
            );

            var canAddOrderItem = order.CanAddOrderItem(contract);
            if (canAddOrderItem.TryPickT1(out error, out var _))
            {
                var applicationError = new ApplicationError(message: error, code: GeneralApplicationErrorCodes.NOT_ALLOWED, path: [uid]);
                validationErrors.Add(applicationError);
                continue;
            }

            order.ExecuteAddOrderItem(contract);
            updatedProducts.Add(product);
        }

        if (validationErrors.Count > 0)
        {
            return validationErrors;
        }

        await _orderRepository.CreateAsync(order);

        foreach (var product in updatedProducts)
        {
            await _productRepository.UpdateAsync(product);
        }

        return new CreateOrderResult(orderId: order.Id);
    }
}