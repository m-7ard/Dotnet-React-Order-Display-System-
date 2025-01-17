using Application.Errors;
using Application.Handlers.OrderItems.MarkFinished;
using Application.Interfaces.Persistence;
using Application.Validators.OrderExistsValidator;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Product;
using Moq;
using OneOf;
using Tests.UnitTests.Utils;

namespace Tests.UnitTests.Application.Api.OrderIItems;

public class MarkOrderItemFinishedHandlerUnitTest
{
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly Mock<IOrderExistsValidator<OrderId>> _mockOrderExistsValidator;
    private readonly Order _mockOrder;
    private readonly MarkOrderItemFinishedHandler _handler;

    public MarkOrderItemFinishedHandlerUnitTest()
    {
        _mockOrderRepository = new Mock<IOrderRepository>();
        _mockOrderExistsValidator = new Mock<IOrderExistsValidator<OrderId>>();

        _handler = new MarkOrderItemFinishedHandler(
            orderRepository: _mockOrderRepository.Object,
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
    public async Task MarkOrderItemFinished_ValidData_Success()
    {
        // ARRANGE
        var mockOrderItem = Mixins.CreateOrderItem(
            orderId: _mockOrder.Id,
            status: OrderItemStatus.Pending,
            dateCreated: _mockOrder.OrderDates.DateCreated,
            dateFinished: null
        );
        _mockOrder.OrderItems.Add(mockOrderItem);

        var command = new MarkOrderItemFinishedCommand(
            orderId: _mockOrder.Id.Value,
            orderItemId: mockOrderItem.Id.Value
        );

        SetupMockServices.SetupOrderExistsValidatorSuccess(_mockOrderExistsValidator, _mockOrder.Id, _mockOrder);

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
        
        SetupMockServices.SetupOrderExistsValidatorFailure(_mockOrderExistsValidator);

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
            orderId: _mockOrder.Id.Value,
            orderItemId: Guid.Empty
        );

        SetupMockServices.SetupOrderExistsValidatorSuccess(_mockOrderExistsValidator,_mockOrder.Id ,_mockOrder);

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
            dateCreated: _mockOrder.OrderDates.DateCreated,
            dateFinished: null
        );
        _mockOrder.OrderItems.Add(mockOrderItem);
        
        var command = new MarkOrderItemFinishedCommand(
            orderId: _mockOrder.Id.Value,
            orderItemId: mockOrderItem.Id.Value
        );

        _mockOrderExistsValidator.Setup(validator => validator.Validate(It.Is<OrderId>(id => id == _mockOrder.Id))).ReturnsAsync(OneOf<Order, List<ApplicationError>>.FromT0(_mockOrder));

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}