using Application.Handlers.Orders.Read;
using Application.Validators.OrderExistsValidator;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Moq;
using OneOf;
using Tests.UnitTests.Utils;

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

        var product = Mixins.CreateProduct(1, []);
        _mockOrder = Mixins.CreateNewOrderWithItem(
            seed: 1,
            product: product,
            productHistory: ProductHistoryFactory.BuildNewProductHistoryFromProduct(product)
        );
    }

    [Fact]
    public async Task ReadOrder_ValidData_Success()
    {
        // ARRANGE
        var command = new ReadOrderQuery(
            id: _mockOrder.Id.Value
        );

        SetupMockServices.SetupOrderExistsValidatorSuccess(_mockOrderExistsValidator, _mockOrder.Id, _mockOrder);

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

        SetupMockServices.SetupOrderExistsValidatorFailure(_mockOrderExistsValidator);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}