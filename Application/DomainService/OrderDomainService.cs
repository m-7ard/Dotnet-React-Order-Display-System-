using Application.Contracts.DomainService.OrderDomainService;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Contracts.Orders;
using Domain.DomainExtension;
using Domain.Models;
using OneOf;

namespace Application.DomainService;

public class OrderDomainService : IOrderDomainService
{
    private readonly IProductDomainService _productDomainService;
    private readonly IProductHistoryDomainService _productHistoryDomainService;
    private readonly ISequenceService _sequenceService;
    private readonly IProductRepository _productRepository;

    public OrderDomainService(IProductDomainService productDomainService, IProductHistoryDomainService productHistoryDomainService, ISequenceService sequenceService, IProductRepository productRepository)
    {
        _productDomainService = productDomainService;
        _productHistoryDomainService = productHistoryDomainService;
        _sequenceService = sequenceService;
        _productRepository = productRepository;
    }

    public async Task<OneOf<Order, string>> TryOrchestrateCreateNewOrder(Guid id)
    {
        var serialNumber = await _sequenceService.GetNextOrderValueAsync();
        var canCreateOrder = OrderDomainExtension.CanCreateNewOrder(id: id, serialNumber: serialNumber);
        if (canCreateOrder.IsT1) return canCreateOrder.AsT1;
        
        return OrderDomainExtension.ExecuteCreateNewOrder(id: id, serialNumber: serialNumber);
    }

    public async Task<OneOf<bool, string>> TryOrchestrateAddNewOrderItem(OrchestrateAddNewOrderItemContract contract)
    {
        var order = contract.Order;
        var productId = contract.ProductId;
        var quantity = contract.Quantity;

        // Product Exists
        var productExistsResult = await _productDomainService.GetProductById(productId);
        if (productExistsResult.IsT1) return productExistsResult.AsT1;
        
        var product = productExistsResult.AsT0;

        // Product History Exists
        var latestProductHistoryExistsResult = await _productHistoryDomainService.GetLatestProductHistoryForProduct(product);
        if (latestProductHistoryExistsResult.IsT1) return latestProductHistoryExistsResult.AsT1;

        var productHistory = latestProductHistoryExistsResult.AsT0;

        // Lower Product Amount
        var canLowerAmount = product.CanLowerAmount(quantity);
        if (canLowerAmount.IsT1) return $"Order Item quantity ({quantity}) cannot be larger than Product amount ({product.Amount})";

        product.ExecuteLowerAmount(quantity);

        // Check if Product History is valid
        if (!productHistory.IsValid()) return $"Product History for Product of Id \"{product.Id}\" is not valid.";

        // Add Order Item
        var addNewOrderItemContract = new AddNewOrderItemContract(
            order: order,
            id: Guid.NewGuid(),
            serialNumber: await _sequenceService.GetNextOrderItemValueAsync(),
            quantity: quantity,
            productId: product.Id,
            productHistoryId: productHistory.Id,
            total: product.Price.Value * quantity
        );
        
        var canAddOrderItem = OrderDomainExtension.CanAddNewOrderItem(addNewOrderItemContract);
        if (canAddOrderItem.IsT1) return canAddOrderItem.AsT1;

        OrderDomainExtension.ExecuteAddNewOrderItem(addNewOrderItemContract);

        // Update Product
        await _productRepository.LazyUpdateAsync(product);
        
        return true;
    }
}