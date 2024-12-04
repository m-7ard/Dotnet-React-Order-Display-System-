using Application.Handlers.Orders.Read;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Moq;

namespace Tests.UnitTests.Application.Api.Orders;

public class ReadOrderHandlerUnitTest
{
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly Order _mockOrder;
    private readonly ReadOrderHandler _handler;

    public ReadOrderHandlerUnitTest()
    {
        _mockOrderRepository = new Mock<IOrderRepository>();
        _handler = new ReadOrderHandler(
            orderRepository: _mockOrderRepository.Object
        );

        _mockOrder = OrderFactory.BuildExistingOrder(
            id: Guid.NewGuid(),
            total: 100,
            dateCreated: DateTime.Today,
            dateFinished: DateTime.MinValue,
            orderItems: [],
            status: OrderStatus.Pending,
            serialNumber: 1
        );
    }

    [Fact]
    public async Task ReadOrder_ValidData_Success()
    {
        // ARRANGE
        var command = new ReadOrderQuery(
            id: _mockOrder.Id
        );

        _mockOrderRepository.Setup(repo => repo.GetByIdAsync(_mockOrder.Id)).ReturnsAsync(_mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
        Assert.Equal(result.AsT0.Order, _mockOrder);
    }

    [Fact]
    public async Task ReadOrder_OrderDoesNotExist_Failure()
    {
        // ARRANGE
        var command = new ReadOrderQuery(
            id: _mockOrder.Id
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}