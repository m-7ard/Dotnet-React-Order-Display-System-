using Application.Handlers.Products.Delete;
using Application.Interfaces.Persistence;
using Application.Validators;
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
            productHistoryRepository: _mockProductHistoryRepository.Object,
            productExistsValidator: new ProductExistsValidatorAsync(_mockProductRepository.Object),
            latestProductHistoryExistsValidator: new LatestProductHistoryExistsValidatorAsync(_mockProductHistoryRepository.Object)
        );
    }

    [Fact]
    public async Task DeleteProduct_ValidProductAndValidProductHistory_Success()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: []
        );

        var mockProductHistory = Mixins.CreateProductHistory(1);

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
        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: []
        );

        var command = new DeleteProductCommand(
            id: mockProduct.Id
        );

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
        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: []
        );

        var command = new DeleteProductCommand(
            id: mockProduct.Id
        );

        _mockProductRepository.Setup(repo => repo.GetByIdAsync(mockProduct.Id)).ReturnsAsync(mockProduct);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        _mockProductRepository.Verify(repo => repo.GetByIdAsync(mockProduct.Id), Times.Once);
        _mockProductHistoryRepository.Verify(repo => repo.GetLatestByProductIdAsync(mockProduct.Id), Times.Once);
    }
}