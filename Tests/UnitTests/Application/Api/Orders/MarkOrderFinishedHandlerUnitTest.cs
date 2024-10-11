using Application.Api.Orders.Create.Handlers;
using Application.Api.Orders.Create.Other;
using Application.Api.Orders.MarkFinished.Handlers;
using Application.Api.Products.Create.Handlers;
using Application.Interfaces.Persistence;
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
            orderRepository: _mockOrderRepository.Object
        );

        _mockOrder = OrderFactory.BuildExistingOrder(
            id: 1,
            total: 100,
            dateCreated: DateTime.Today,
            dateFinished: DateTime.MinValue,
            orderItems: [],
            status: OrderStatus.Pending
        );
    }

    [Fact]
    public async Task MarkOrderFinished_ValidData_Success()
    {
        // ARRANGE
        var command = new MarkOrderFinishedCommand(
            orderId: _mockOrder.Id
        );

        _mockOrder.OrderItems = [new OrderItem(id: 1, quantity: 1, status: OrderItemStatus.Finished, dateCreated: _mockOrder.DateCreated, dateFinished: DateTime.MinValue, orderId: _mockOrder.Id, productHistoryId: 1, productId: 1)];

        _mockOrderRepository.Setup(repo => repo.GetByIdAsync(_mockOrder.Id)).ReturnsAsync(_mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
        _mockOrderRepository.Verify(repo => repo.UpdateAsync(It.Is<Order>(d => d.Status == OrderStatus.Finished)), Times.Once);
    }

    [Fact]
    public async Task MarkOrderFinished_UnfinishedOrderItems_Failure()
    {
        // ARRANGE
        var command = new MarkOrderFinishedCommand(
            orderId: _mockOrder.Id
        );

        _mockOrder.OrderItems = [new OrderItem(id: 1, quantity: 1, status: OrderItemStatus.Pending, dateCreated: _mockOrder.DateCreated, dateFinished: DateTime.MinValue, orderId: _mockOrder.Id, productHistoryId: 1, productId: 1)];

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

        _mockOrder.OrderItems = [new OrderItem(id: 1, quantity: 1, status: OrderItemStatus.Finished, dateCreated: _mockOrder.DateCreated, dateFinished: DateTime.MinValue, orderId: _mockOrder.Id, productHistoryId: 1, productId: 1)];
        _mockOrder.Status = OrderStatus.Finished;

        _mockOrderRepository.Setup(repo => repo.GetByIdAsync(_mockOrder.Id)).ReturnsAsync(_mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}