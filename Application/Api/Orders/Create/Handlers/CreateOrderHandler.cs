using Application.ErrorHandling.Application;
using Application.ErrorHandling.Other;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using MediatR;
using OneOf;

namespace Application.Api.Orders.Create.Handlers;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OneOf<CreateOrderResult, List<PlainApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderItemRepository _orderItemRepository;

    public CreateOrderHandler(IProductRepository productRepository, IProductHistoryRepository productHistoryRepository, IOrderRepository orderRepository, IOrderItemRepository orderItemRepository)
    {
        _productRepository = productRepository;
        _productHistoryRepository = productHistoryRepository;
        _orderRepository = orderRepository;
        _orderItemRepository = orderItemRepository;
    }

    public async Task<OneOf<CreateOrderResult, List<PlainApplicationError>>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var errors = new List<PlainApplicationError>();
       
        var retrievedProductsHistory = new Dictionary<string, ProductHistory>();

        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            var product = await _productRepository.GetByIdAsync(orderItem.ProductId);

            if (product is null) 
            {
                errors.Add(
                    new PlainApplicationError(
                        message: $"Product with Id \"{orderItem.ProductId}\" does not exist.",
                        path: ["orderItems", uid, "id"],
                        code: ValidationErrorCodes.ModelDoesNotExist
                    )
                );
                continue;
            }

            var latestProductHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);

            if (latestProductHistory is null) 
            {
                errors.Add(
                    new PlainApplicationError(
                        message: $"Product with Id \"{orderItem.ProductId}\" does not have a ProductHistory. All Products should have a ProductHistory when created and updated.",
                        path: ["orderItems", uid, "_"],
                        code: ValidationErrorCodes.StateMismatch
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

        float total = 0;
        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            var productHistory = retrievedProductsHistory[uid];
            total += productHistory.Price * orderItem.Quantity;
        }

        var inputOrder = OrderFactory.BuildNewOrder(
            total: total,
            orderItems: [],
            status: OrderStatus.Pending
        );
        var outputOrder = await _orderRepository.CreateAsync(inputOrder);

        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            var inputOrderItem = OrderItemFactory.BuildNewOrderItem(
                quantity: orderItem.Quantity,
                status: OrderItemStatus.Pending,
                orderId: outputOrder.Id,
                productHistory: retrievedProductsHistory[uid]
            );
            var outputOrderItem = await _orderItemRepository.CreateAsync(inputOrderItem);
            outputOrder.OrderItems.Add(outputOrderItem);
        }

        return new CreateOrderResult(order: outputOrder);
    }
}