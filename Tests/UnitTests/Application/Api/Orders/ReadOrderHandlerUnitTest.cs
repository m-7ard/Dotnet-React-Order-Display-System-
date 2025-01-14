using Application.Errors;
using Application.Handlers.Orders.Read;
using Application.Validators.OrderExistsValidator;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Moq;
using OneOf;

namespace Tests.UnitTests.Application.Api.Orders;

public class ReadOrderHandlerUnitTest
{
    private readonly Order _mockOrder;
    private readonly ReadOrderHandler _handler;
    private readonly Mock<IOrderExistsValidator<OrderId>> _mockOrderExistsValidator;

    public ReadOrderHandlerUnitTest()
    {
        _mockOrderExistsValidator = new Mock<IOrderExistsValidator<OrderId>>();

        _handler = new ReadOrderHandler(
            orderExistsValidator: _mockOrderExistsValidator.Object
        );

        _mockOrder = OrderFactory.BuildExistingOrder(
            id: OrderId.ExecuteCreate(new Guid()),
            total: 100,
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
    public async Task ReadOrder_ValidData_Success()
    {
        // ARRANGE
        var command = new ReadOrderQuery(
            id: _mockOrder.Id.Value
        );

        _mockOrderExistsValidator.Setup(validator => validator.Validate(It.Is<OrderId>(id => id == _mockOrder.Id))).ReturnsAsync(OneOf<Order, List<ApplicationError>>.FromT0(_mockOrder));

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
            id: _mockOrder.Id.Value
        );

        _mockOrderExistsValidator.Setup(validator => validator.Validate(It.Is<OrderId>(id => id == _mockOrder.Id))).ReturnsAsync(OneOf<Order, List<ApplicationError>>.FromT1([]));

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}