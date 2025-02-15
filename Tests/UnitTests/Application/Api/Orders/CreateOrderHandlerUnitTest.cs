using Application.Handlers.Orders.Create;
using Application.Interfaces.Persistence;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.Shared;
using Moq;
using Tests.UnitTests.Utils;

namespace Tests.UnitTests.Application.Api.Orders;

public class CreateOrderHandlerUnitTest
{
    private readonly Mock<ISequenceService> _mockSequenceService;
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly Mock<IProductExistsValidator<ProductId>> _mockProductExistsValidator;
    private readonly Mock<ILatestProductHistoryExistsValidator<ProductId>> _latestProductHistoryExistsByIdValidator;
    private readonly Product _mockProduct001;
    private readonly Product _mockProduct002;
    private readonly ProductHistory _mockProductHistory001;
    private readonly ProductHistory _mockProductHistory002;
    private readonly CreateOrderHandler _handler;

    public CreateOrderHandlerUnitTest()
    {
        _mockOrderRepository = new Mock<IOrderRepository>();
        _mockSequenceService = new Mock<ISequenceService>();
        _mockProductExistsValidator = new Mock<IProductExistsValidator<ProductId>>(); 
        _latestProductHistoryExistsByIdValidator = new Mock<ILatestProductHistoryExistsValidator<ProductId>>();
        
        _handler = new CreateOrderHandler(
            productExistsValidator: _mockProductExistsValidator.Object,
            latestProductHistoryExistsValidator: _latestProductHistoryExistsByIdValidator.Object,
            orderRepository: _mockOrderRepository.Object,
            sequenceService: _mockSequenceService.Object
        );
    
        _mockProduct001 = ProductFactory.BuildExistingProduct(
            id: ProductId.ExecuteCreate(Guid.NewGuid()),
            name: "Product 1",
            price: Money.ExecuteCreate(1),
            description: "description",
            dateCreated: new DateTime(),
            images: []
        );
        _mockProduct002 = ProductFactory.BuildExistingProduct(
            id: ProductId.ExecuteCreate(Guid.NewGuid()),
            name: "Product 2",
            price: Money.ExecuteCreate(2),
            description: "description",
            dateCreated: new DateTime(),
            images: []
        );

        _mockProductHistory001 = ProductHistoryFactory.BuildNewProductHistoryFromProduct(_mockProduct001);
        _mockProductHistory002 = ProductHistoryFactory.BuildNewProductHistoryFromProduct(_mockProduct002);
    }

    [Fact]
    public async Task CreateOrder_WitbhoutImages_Success()
    {
        // ARRANGE
        var command = new CreateOrderCommand(
            orderItemData: new Dictionary<string, CreateOrderCommand.OrderItem>() 
            {
                { "UID-1", new CreateOrderCommand.OrderItem(productId: _mockProduct001.Id.Value, quantity: 1) },
                { "UID-2", new CreateOrderCommand.OrderItem(productId: _mockProduct002.Id.Value, quantity: 2) }
            }
        );

        var total = _mockProduct001.Price + _mockProduct002.Price * 2;

        SetupMockServices.SetupProductExistsValidatorSuccess(_mockProductExistsValidator, _mockProduct001.Id, _mockProduct001);
        SetupMockServices.SetupProductExistsValidatorSuccess(_mockProductExistsValidator, _mockProduct002.Id, _mockProduct002);

        SetupMockServices.SetupLatestProductHistoryExistsValidatorSuccess(_latestProductHistoryExistsByIdValidator, _mockProduct001.Id, _mockProductHistory001);
        SetupMockServices.SetupLatestProductHistoryExistsValidatorSuccess(_latestProductHistoryExistsByIdValidator, _mockProduct002.Id, _mockProductHistory002);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);

        _mockOrderRepository
            .Verify(repo => repo.CreateAsync(It.Is<Order>(order => order.OrderItems.Count == 2)), Times.Once);
        _mockOrderRepository
            .Verify(repo => repo.CreateAsync(It.Is<Order>(order => order.Total == total)), Times.Once);
        _mockOrderRepository
            .Verify(repo => repo.CreateAsync(It.Is<Order>(order => order.Status == OrderStatus.Pending)), Times.Once);
    }

    [Fact]
    public async Task CreateOrder_ProductDoesNotExist_Failure()
    {
        // ARRANGE
        var command = new CreateOrderCommand(
            orderItemData: new Dictionary<string, CreateOrderCommand.OrderItem>() 
            {
                { "UID-1", new CreateOrderCommand.OrderItem(productId: _mockProductHistory001.Id.Value, quantity: 1) },
            }
        );
        
        SetupMockServices.SetupProductExistsValidatorFailure(_mockProductExistsValidator);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }

    [Fact]
    public async Task CreateOrder_ProductHistoryDoesNotExist_Failure()
    {
        // ARRANGE
        var command = new CreateOrderCommand(
            orderItemData: new Dictionary<string, CreateOrderCommand.OrderItem>() 
            {
                { "UID-1", new CreateOrderCommand.OrderItem(productId: _mockProductHistory001.Id.Value, quantity: 1) },
            }
        );

        SetupMockServices.SetupProductExistsValidatorSuccess(_mockProductExistsValidator, _mockProduct001.Id, _mockProduct001);
        SetupMockServices.SetupLatestProductHistoryExistsValidatorFailure(_latestProductHistoryExistsByIdValidator);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}