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

        var retrievedProductsHistory = new Dictionary<string, ProductHistory>();
        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            var product = await _productRepository.GetByIdAsync(orderItem.ProductId);

            if (product is null)
            {
                errors.Add(
                    new ApplicationError(
                        message: $"Product with Id \"{orderItem.ProductId}\" does not exist.",
                        path: ["orderItems", uid, "id"],
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

            retrievedProductsHistory[uid] = latestProductHistory;
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        // var newOrder = OrderFactory.BuildNewOrder(
        //     total: 0,
        //     orderItems: [],
        //     status: OrderStatus.Pending
        // );

        // Calc total
        decimal total = request.OrderItemData.Keys.Sum(uid =>
        {
            var productHistory = retrievedProductsHistory[uid];
            var orderItem = request.OrderItemData[uid];
            return productHistory.Price * orderItem.Quantity;
        });

        // Create Order
        var generatedId = Guid.NewGuid();
        var inputOrder = OrderFactory.BuildNewOrder(
            id: generatedId,
            total: total,
            orderItems: request.OrderItemData.Keys.Select(uid =>
            {
                var orderItemData = request.OrderItemData[uid];
                return OrderItemFactory.BuildNewOrderItem(
                    id: Guid.NewGuid(),
                    orderId: generatedId,
                    quantity: orderItemData.Quantity,
                    status: OrderItemStatus.Pending,
                    productHistoryId: retrievedProductsHistory[uid].Id,
                    productId: orderItemData.ProductId
                );
            }).ToList(),
            status: OrderStatus.Pending
        );

        await _orderRepository.CreateAsync(inputOrder);
        return new CreateOrderResult(order: inputOrder);
    }
}