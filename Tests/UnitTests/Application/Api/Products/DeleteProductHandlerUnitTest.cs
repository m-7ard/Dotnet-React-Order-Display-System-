using Application.Handlers.Products.Delete;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Moq;

namespace Tests.UnitTests.Application.Api.Products;

public class DeleteProductHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IProductHistoryRepository> _mockProductHistoryRepository;
    private readonly DeleteProductHandler _handler;

    public DeleteProductHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        _handler = new DeleteProductHandler(
            productRepository: _mockProductRepository.Object,
            productHistoryRepository: _mockProductHistoryRepository.Object
        );
    }

    [Fact]
    public async Task DeleteProduct_ValidProductAndValidProductHistory_Success()
    {
        // ARRANGE
        var mockProduct = ProductFactory.BuildExistingProduct(
            id: 100,
            name: "Product 1",
            price: 1,
            description: "description",
            images: [],
            dateCreated: new DateTime()
        );

        var mockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(mockProduct);

        var command = new DeleteProductCommand(
            id: mockProduct.Id
        );

        // Product Exists
        _mockProductRepository
            .Setup(repo => repo.GetByIdAsync(mockProduct.Id))
            .ReturnsAsync(mockProduct);

        // ProductHistory Exists
        _mockProductHistoryRepository
            .Setup(repo => repo.GetLatestByProductIdAsync(mockProduct.Id))
            .ReturnsAsync(mockProductHistory);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
        _mockProductHistoryRepository.Verify(repo => repo.UpdateAsync(It.Is<ProductHistory>(d => d.ValidTo > d.ValidFrom)), Times.Once);
        _mockProductRepository.Verify(repo => repo.DeleteByIdAsync(mockProduct.Id));
    }

    [Fact]
    public async Task DeleteProduct_ProductDoesNotExist_Failure()
    {
        // ARRANGE
        var mockProduct = ProductFactory.BuildExistingProduct(
            id: 100,
            name: "Product 1",
            price: 1,
            description: "description",
            images: [],
            dateCreated: new DateTime()
        );

        var command = new DeleteProductCommand(
            id: mockProduct.Id
        );

        // Product Exists
        _mockProductRepository
            .Setup(repo => repo.GetByIdAsync(mockProduct.Id));

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        _mockProductRepository.Verify(repo => repo.GetByIdAsync(mockProduct.Id), Times.Once);
    }
    
    [Fact]
    public async Task DeleteProduct_ProductHistoryDoesNotExist_Failure()
    {
        // ARRANGE
        var mockProduct = ProductFactory.BuildExistingProduct(
            id: 100,
            name: "Product 1",
            price: 1,
            description: "description",
            images: [],
            dateCreated: new DateTime()
        );

        var command = new DeleteProductCommand(
            id: mockProduct.Id
        );

        _mockProductRepository.Setup(repo => repo.GetByIdAsync(mockProduct.Id)).ReturnsAsync(mockProduct);
        _mockProductHistoryRepository.Setup(repo => repo.GetLatestByProductIdAsync(mockProduct.Id));

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        _mockProductRepository.Verify(repo => repo.GetByIdAsync(mockProduct.Id), Times.Once);
        _mockProductHistoryRepository.Verify(repo => repo.GetLatestByProductIdAsync(mockProduct.Id), Times.Once);
    }
}