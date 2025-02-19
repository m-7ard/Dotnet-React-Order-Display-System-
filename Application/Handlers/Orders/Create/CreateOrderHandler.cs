using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.Contracts.Orders;
using Domain.DomainFactories;
using Domain.DomainService;
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
        // Create New Order 
        var serialNumber = await _sequenceService.GetNextOrderValueAsync();
        var canCreateOrder = OrderDomainService.CanCreateNewOrder(id: request.Id, serialNumber: serialNumber);
        if (canCreateOrder.IsT1) return new CannotCreateOrderError(message: canCreateOrder.AsT1, path: []).AsList();

        var order = OrderDomainService.ExecuteCreateNewOrder(id: request.Id, serialNumber: serialNumber);

        // Create Order Items
        var updatedProducts = new List<Product>();
        var validationErrors = new List<ApplicationError>();

        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            // Product Exists
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

            // Product History Exists
            var latestProductHistoryExistsResult = await _latestProductHistoryExistsValidator.Validate(ProductId.ExecuteCreate(orderItem.ProductId));
            if (latestProductHistoryExistsResult.TryPickT1(out errors, out var productHistory))
            {
                validationErrors.AddRange(errors.Select(error => new ApplicationError(message: error.Message, code: error.Code, path: [uid, ..error.Path])));
                continue;
            }
            
            // Add Order Item
            var addOrderItemContract = new AddOrderItemContract(
                id: Guid.NewGuid(), 
                product: product, 
                productHistory: productHistory, 
                quantity: orderItem.Quantity, 
                serialNumber: await _sequenceService.GetNextOrderItemValueAsync(),
                status: OrderItemStatus.Pending.Name,
                dateCreated: DateTime.UtcNow,
                dateFinished: null
            );

            var canAddOrderItem = order.CanAddOrderItem(addOrderItemContract);
            if (canAddOrderItem.TryPickT1(out error, out var _))
            {
                var applicationError = new ApplicationError(message: error, code: GeneralApplicationErrorCodes.NOT_ALLOWED, path: [uid]);
                validationErrors.Add(applicationError);
                continue;
            }

            order.ExecuteAddOrderItem(addOrderItemContract);

            // Update Later
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

        return new CreateOrderResult();
    }
}