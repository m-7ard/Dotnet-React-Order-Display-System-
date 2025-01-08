using Application.Handlers.Orders.MarkFinished;
using Application.Interfaces.Persistence;
using Application.Validators;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Moq;

namespace Tests.UnitTests.Application.Api.Orders;

public class MarkOrderFinishedHandlerUnitTest
{
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly Order _mockOrder;
    private readonly MarkOrderFinishedHandler _handler;

    public MarkOrderFinishedHandlerUnitTest()
    {
        _mockOrderRepository = new Mock<IOrderRepository>();
        _handler = new MarkOrderFinishedHandler(
            orderRepository: _mockOrderRepository.Object,
            orderExistsValidator: new OrderExistsValidatorAsync(_mockOrderRepository.Object)
        );

        _mockOrder = OrderFactory.BuildExistingOrder(
            id: Guid.NewGuid(),
            total: 100,
            orderDates: OrderDates.ExecuteCreate(
                dateCreated: DateTime.Today,
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
            orderId: _mockOrder.Id
        );

        _mockOrder.OrderItems = [
            Mixins.CreateOrderItem(
                orderId: _mockOrder.Id,
                status: OrderItemStatus.Finished,
                dateCreated: _mockOrder.OrderDates.DateCreated,
                dateFinished: null
            )
        ];
        _mockOrderRepository.Setup(repo => repo.GetByIdAsync(_mockOrder.Id)).ReturnsAsync(_mockOrder);

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
            orderId: _mockOrder.Id
        );

        _mockOrder.OrderItems = [
            Mixins.CreateOrderItem(
                orderId: _mockOrder.Id,
                status: OrderItemStatus.Pending,
                dateCreated: _mockOrder.OrderDates.DateCreated,
                dateFinished: null
            )
        ];

        _mockOrderRepository.Setup(repo => repo.GetByIdAsync(_mockOrder.Id)).ReturnsAsync(_mockOrder);

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
            orderId: _mockOrder.Id
        );

        _mockOrder.OrderItems = [
            Mixins.CreateOrderItem(
                orderId: _mockOrder.Id,
                status: OrderItemStatus.Pending,
                dateCreated: _mockOrder.OrderDates.DateCreated,
                dateFinished: null
            )
        ];
        _mockOrder.Status = OrderStatus.Finished;

        _mockOrderRepository.Setup(repo => repo.GetByIdAsync(_mockOrder.Id)).ReturnsAsync(_mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}