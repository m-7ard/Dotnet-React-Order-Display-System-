using Application.Errors;
using Application.Handlers.Orders.MarkFinished;
using Application.Interfaces.Persistence;
using Application.Validators.OrderExistsValidator;
using Domain.Contracts.Orders;
using Domain.DomainFactories;
using Domain.DomainService;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Moq;
using OneOf;
using Tests.UnitTests.Utils;

namespace Tests.UnitTests.Application.Api.Orders;

public class MarkOrderFinishedHandlerUnitTest
{
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly Order _mockOrder;
    private readonly OrderItem _mockOrderItem;
    private readonly MarkOrderFinishedHandler _handler;
    private readonly Mock<IOrderExistsValidator<OrderId>> _mockOrderExistsValidator;

    public MarkOrderFinishedHandlerUnitTest()
    {
        _mockOrderRepository = new Mock<IOrderRepository>();
        _mockOrderExistsValidator = new Mock<IOrderExistsValidator<OrderId>>();

        _handler = new MarkOrderFinishedHandler(
            orderRepository: _mockOrderRepository.Object,
            orderExistsValidator: _mockOrderExistsValidator.Object
        );
        
        var product = Mixins.CreateProduct(1, []);
        _mockOrder = OrderDomainService.ExecuteCreateNewOrder(id: Guid.NewGuid(), serialNumber: 1);
        var contract = new AddNewOrderItemContract(
            order: _mockOrder,
            id: Guid.NewGuid(), 
            product: product,
            productHistory: ProductHistoryFactory.BuildNewProductHistoryFromProduct(product),
            quantity: 1,
            serialNumber: 1
        );
        var orderItemId = OrderDomainService.ExecuteAddNewOrderItem(contract);
        _mockOrderItem = _mockOrder.ExecuteGetOrderItemById(orderItemId);
    }

    [Fact]
    public async Task MarkOrderFinished_ValidData_Success()
    {
        // ARRANGE
        OrderDomainService.ExecuteMarkOrderItemFinished(_mockOrder, _mockOrderItem.Id);

        var command = new MarkOrderFinishedCommand(
            orderId: _mockOrder.Id.Value
        );

        SetupMockServices.SetupOrderExistsValidatorSuccess(_mockOrderExistsValidator, _mockOrder.Id, _mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
        _mockOrderRepository.Verify(repo => repo.UpdateAsync(It.Is<Order>(d => d.OrderSchedule.Status == OrderStatus.Finished)), Times.Once);
    }

    [Fact]
    public async Task MarkOrderFinished_OrderDoesNotExist_Failure()
    {
        // ARRANGE
        var command = new MarkOrderFinishedCommand(
            orderId: Guid.Empty
        );
        _mockOrderExistsValidator.Setup(validator => validator.Validate(It.Is<OrderId>(id => id.Value == command.OrderId))).ReturnsAsync(OneOf<Order, List<ApplicationError>>.FromT1([]));

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }

    [Fact]
    public async Task MarkOrderFinished_UnfinishedOrderItems_Failure()
    {
        // ARRANGE
        var command = new MarkOrderFinishedCommand(
            orderId: _mockOrder.Id.Value
        );

        SetupMockServices.SetupOrderExistsValidatorFailure(_mockOrderExistsValidator);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }

    [Fact]
    public async Task MarkOrderFinished_OrderAlreadyFinished_Failure()
    {
        // ARRANGE
        var command = new MarkOrderFinishedCommand(
            orderId: _mockOrder.Id.Value
        );
        _mockOrderExistsValidator.Setup(validator => validator.Validate(It.Is<OrderId>(id => id == _mockOrder.Id))).ReturnsAsync(OneOf<Order, List<ApplicationError>>.FromT1([]));

        OrderDomainService.ExecuteMarkOrderItemFinished(_mockOrder, _mockOrderItem.Id);
        OrderDomainService.ExecuteMarkFinished(_mockOrder);

        SetupMockServices.SetupOrderExistsValidatorSuccess(_mockOrderExistsValidator, _mockOrder.Id, _mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}