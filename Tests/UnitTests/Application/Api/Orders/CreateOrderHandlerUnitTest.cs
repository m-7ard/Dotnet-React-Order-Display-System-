using Api.DTOs.Orders.Create;
using Application.Handlers.Orders.Create;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Moq;

namespace Tests.UnitTests.Application.Api.Orders;

public class CreateOrderHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IProductHistoryRepository> _mockProductHistoryRepository;
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly Product _mockProduct001;
    private readonly Product _mockProduct002;
    private readonly ProductHistory _mockProductHistory001;
    private readonly ProductHistory _mockProductHistory002;
    private readonly CreateOrderHandler _handler;

    public CreateOrderHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockOrderRepository = new Mock<IOrderRepository>();
        _mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        _handler = new CreateOrderHandler(
            productRepository: _mockProductRepository.Object,
            productHistoryRepository: _mockProductHistoryRepository.Object,
            orderRepository: _mockOrderRepository.Object
        );
    
        _mockProduct001 = ProductFactory.BuildExistingProduct(
            id: 1,
            name: "Product 1",
            price: 1,
            description: "description",
            dateCreated: new DateTime(),
            images: []
        );
        _mockProduct002 = ProductFactory.BuildExistingProduct(
            id: 2,
            name: "Product 2",
            price: 2,
            description: "description",
            dateCreated: new DateTime(),
            images: []
        );

        _mockProductHistory001 = ProductHistoryFactory.BuildNewProductHistoryFromProduct(_mockProduct001);
        _mockProductHistory002 = ProductHistoryFactory.BuildNewProductHistoryFromProduct(_mockProduct002);
    }

    [Fact]
    public async Task CreateProduct_WitbhoutImages_Success()
    {
        // ARRANGE
        var command = new CreateOrderCommand(
            orderItemData: new Dictionary<string, CreateOrderCommand.OrderItem>() 
            {
                { "UID-1", new CreateOrderCommand.OrderItem(productId: 1, quantity: 1) },
                { "UID-2", new CreateOrderCommand.OrderItem(productId: 2, quantity: 2) }
            }
        );

        var total = _mockProduct001.Price + _mockProduct002.Price * 2;

        _mockProductRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(_mockProduct001);
        _mockProductRepository.Setup(repo => repo.GetByIdAsync(2)).ReturnsAsync(_mockProduct002);

        _mockProductHistoryRepository.Setup(repo => repo.GetLatestByProductIdAsync(1)).ReturnsAsync(_mockProductHistory001);
        _mockProductHistoryRepository.Setup(repo => repo.GetLatestByProductIdAsync(2)).ReturnsAsync(_mockProductHistory002);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);

        _mockOrderRepository.Verify(repo => repo.CreateAsync(It.Is<Order>(order => order.OrderItems.Count == 2)), Times.Once);
        _mockOrderRepository.Verify(repo => repo.CreateAsync(It.Is<Order>(order => order.Total == total)), Times.Once);
        _mockOrderRepository.Verify(repo => repo.CreateAsync(It.Is<Order>(order => order.Status == OrderStatus.Pending)), Times.Once);
    }

    [Fact]
    public async Task CreateProduct_ProductDoesNotExist_Failure()
    {
        // ARRANGE
        var command = new CreateOrderCommand(
            orderItemData: new Dictionary<string, CreateOrderCommand.OrderItem>() 
            {
                { "UID-1", new CreateOrderCommand.OrderItem(productId: 1, quantity: 1) },
            }
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }

    [Fact]
    public async Task CreateProduct_ProductHistoryDoesNotExist_Failure()
    {
        // ARRANGE
        var command = new CreateOrderCommand(
            orderItemData: new Dictionary<string, CreateOrderCommand.OrderItem>() 
            {
                { "UID-1", new CreateOrderCommand.OrderItem(productId: 1, quantity: 1) },
            }
        );

        _mockProductRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(_mockProduct001);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}