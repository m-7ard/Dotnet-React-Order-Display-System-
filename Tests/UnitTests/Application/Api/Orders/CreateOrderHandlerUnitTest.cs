using Application.Errors.Objects;
using Application.Handlers.Orders.Create;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.DomainFactories;
using Domain.Models;
using Moq;
using Tests.UnitTests.Utils;

namespace Tests.UnitTests.Application.Api.Orders;

public class CreateOrderHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly Mock<IOrderDomainService> _mockOrderDomainService;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;

    private readonly Product _mockProduct001;
    private readonly Product _mockProduct002;
    private readonly CreateOrderHandler _handler;

    public CreateOrderHandlerUnitTest()
    {
        _mockOrderRepository = new Mock<IOrderRepository>();
        _mockProductRepository = new Mock<IProductRepository>();
        
        _mockOrderDomainService = new Mock<IOrderDomainService>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();

        _handler = new CreateOrderHandler(
            orderRepository: _mockOrderRepository.Object,
            productRepository: _mockProductRepository.Object,
            orderDomainService: _mockOrderDomainService.Object,
            unitOfWork: _mockUnitOfWork.Object
        );
    
        _mockProduct001 = Mixins.CreateProduct(1, []);
        _mockProduct002 = Mixins.CreateProduct(2, []);
    }

    [Fact]
    public async Task CreateOrder_ValidData_Success()
    {
        // ARRANGE
        var command = new CreateOrderCommand(
            orderItemData: new Dictionary<string, CreateOrderCommand.OrderItem>() 
            {
                { "UID-1", new CreateOrderCommand.OrderItem(productId: _mockProduct001.Id.Value, quantity: 1) },
                { "UID-2", new CreateOrderCommand.OrderItem(productId: _mockProduct002.Id.Value, quantity: 2) }
            },
            id: Guid.NewGuid()
        );

        SetupMockServices.SetupOrderDomainService_TryCreateNewOrder_Success(_mockOrderDomainService, BlankOrder.Instance);
        SetupMockServices.SetupOrderDomainService_TryOrchestrateAddNewOrderItem_Success(_mockOrderDomainService);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task CreateOrder_CannotCreateOrder_Failure()
    {
        // ARRANGE
        var command = new CreateOrderCommand(
            orderItemData: new Dictionary<string, CreateOrderCommand.OrderItem>() 
            {
                { "UID-1", new CreateOrderCommand.OrderItem(productId: _mockProduct001.Id.Value, quantity: 1) },
            },
            id: Guid.NewGuid()
        );
        
        SetupMockServices.SetupOrderDomainService_TryCreateNewOrder_Failure(_mockOrderDomainService);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotCreateOrderError>(result.AsT1.First());
    }

    [Fact]
    public async Task CreateOrder_CannotCreateOrderItem_Failure()
    {
        // ARRANGE
        var command = new CreateOrderCommand(
            orderItemData: new Dictionary<string, CreateOrderCommand.OrderItem>() 
            {
                { "UID-1", new CreateOrderCommand.OrderItem(productId: _mockProduct001.Id.Value, quantity: 1) },
            },
            id: Guid.NewGuid()
        );

        SetupMockServices.SetupOrderDomainService_TryCreateNewOrder_Success(_mockOrderDomainService, BlankOrder.Instance);
        SetupMockServices.SetupOrderDomainService_TryOrchestrateAddNewOrderItem_Failure(_mockOrderDomainService);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotCreateOrderItemError>(result.AsT1.First());
    }
}