using Application.Handlers.OrderItems.MarkFinished;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Moq;

namespace Tests.UnitTests.Application.Api.OrderIItems;

public class MarkOrderItemFinishedHandlerUnitTest
{
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly Order _mockOrder;
    private readonly MarkOrderItemFinishedHandler _handler;

    public MarkOrderItemFinishedHandlerUnitTest()
    {
        _mockOrderRepository = new Mock<IOrderRepository>();
        _handler = new MarkOrderItemFinishedHandler(
            orderRepository: _mockOrderRepository.Object
        );

        _mockOrder = OrderFactory.BuildExistingOrder(
            id: new Guid(),
            total: 100,
            dateCreated: DateTime.Today,
            dateFinished: DateTime.MinValue,
            orderItems: [],
            status: OrderStatus.Pending
        );
    }

    [Fact]
    public async Task MarkOrderItemFinished_ValidData_Success()
    {
        // ARRANGE
        var mockOrderItem = Mixins.CreateOrderItem(
            orderId: _mockOrder.Id,
            status: OrderItemStatus.Pending,
            dateCreated: _mockOrder.DateCreated,
            dateFinished: DateTime.MinValue
        );
        _mockOrder.OrderItems.Add(mockOrderItem);

        var command = new MarkOrderItemFinishedCommand(
            orderId: _mockOrder.Id,
            orderItemId: mockOrderItem.Id
        );

        _mockOrderRepository.Setup(repo => repo.GetByIdAsync(_mockOrder.Id)).ReturnsAsync(_mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
        _mockOrderRepository.Verify(repo => repo.UpdateAsync(It.Is<Order>(d => d.OrderItems[0].Status == OrderItemStatus.Finished)), Times.Once);
    }

    [Fact]
    public async Task MarkOrderItemFinished_OrderDoesNotExist_Failure()
    {
        // ARRANGE
        var command = new MarkOrderItemFinishedCommand(
            orderId: Guid.Empty,
            orderItemId: Guid.Empty
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }

    [Fact]
    public async Task MarkOrderItemFinished_OrderItemDoesNotExist_Failure()
    {
        // ARRANGE
        _mockOrder.OrderItems = [];
        
        var command = new MarkOrderItemFinishedCommand(
            orderId: _mockOrder.Id,
            orderItemId: Guid.Empty
        );

        _mockOrderRepository.Setup(repo => repo.GetByIdAsync(_mockOrder.Id)).ReturnsAsync(_mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }

    [Fact]
    public async Task MarkOrderItemFinished_OrderItemAreadyFinished_Failure()
    {
        // ARRANGE
        var mockOrderItem = Mixins.CreateOrderItem(
            orderId: _mockOrder.Id,
            status: OrderItemStatus.Finished,
            dateCreated: _mockOrder.DateCreated,
            dateFinished: DateTime.MinValue
        );
        _mockOrder.OrderItems.Add(mockOrderItem);
        
        var command = new MarkOrderItemFinishedCommand(
            orderId: _mockOrder.Id,
            orderItemId: mockOrderItem.Id
        );

        _mockOrderRepository.Setup(repo => repo.GetByIdAsync(_mockOrder.Id)).ReturnsAsync(_mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}