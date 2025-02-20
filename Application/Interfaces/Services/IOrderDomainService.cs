using Application.Contracts.DomainService.OrderDomainService;
using Domain.Models;
using OneOf;

namespace Application.Interfaces.Services;

public interface IOrderDomainService
{
    Task<OneOf<Order, string>> TryOrchestrateCreateNewOrder(Guid id);
    Task<OneOf<bool, string>> TryOrchestrateAddNewOrderItem(OrchestrateAddNewOrderItemContract contract);
}