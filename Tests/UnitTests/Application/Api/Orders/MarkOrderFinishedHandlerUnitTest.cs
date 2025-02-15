using Application.Errors;
using Application.Handlers.Orders.MarkFinished;
using Application.Interfaces.Persistence;
using Application.Validators.OrderExistsValidator;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Shared;
using Moq;
using OneOf;
using Tests.UnitTests.Utils;

namespace Tests.UnitTests.Application.Api.Orders;

public class MarkOrderFinishedHandlerUnitTest
{
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly Order _mockOrder;
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

        _mockOrder = OrderFactory.BuildExistingOrder(
            id: OrderId.ExecuteCreate(new Guid()),
            total: Money.ExecuteCreate(100),
            orderDates: OrderDates.ExecuteCreate(
                dateCreated: DateTime.UtcNow,
                dateFinished: null
            ),
            orderItems: [],
            status: OrderStatus.Pending,
            serialNumber: 1
        );
    }

    [Fact]
    public async Task MarkOrderFinished_ValidData_Success()
    {
        // ARRANGE
        var command = new MarkOrderFinishedCommand(
            orderId: _mockOrder.Id.Value
        );

        _mockOrder.OrderItems = [
            Mixins.CreateOrderItem(
                orderId: _mockOrder.Id,
                status: OrderItemStatus.Finished,
                dateCreated: _mockOrder.OrderDates.DateCreated,
                dateFinished: null
            )
        ];

        SetupMockServices.SetupOrderExistsValidatorSuccess(_mockOrderExistsValidator, _mockOrder.Id, _mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
        _mockOrderRepository.Verify(repo => repo.UpdateAsync(It.Is<Order>(d => d.Status == OrderStatus.Finished)), Times.Once);
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

        _mockOrder.OrderItems = [
            Mixins.CreateOrderItem(
                orderId: _mockOrder.Id,
                status: OrderItemStatus.Pending,
                dateCreated: _mockOrder.OrderDates.DateCreated,
                dateFinished: null
            )
        ];

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

        _mockOrder.OrderItems = [
            Mixins.CreateOrderItem(
                orderId: _mockOrder.Id,
                status: OrderItemStatus.Pending,
                dateCreated: _mockOrder.OrderDates.DateCreated,
                dateFinished: null
            )
        ];
        _mockOrder.Status = OrderStatus.Finished;

        SetupMockServices.SetupOrderExistsValidatorSuccess(_mockOrderExistsValidator, _mockOrder.Id, _mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}