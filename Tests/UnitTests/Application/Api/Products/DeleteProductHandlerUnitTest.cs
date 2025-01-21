using Application.Handlers.Products.Delete;
using Application.Interfaces.Persistence;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.Models;
using Domain.ValueObjects.Product;
using Moq;
using Tests.UnitTests.Utils;

namespace Tests.UnitTests.Application.Api.Products;

public class DeleteProductHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IProductHistoryRepository> _mockProductHistoryRepository;
    private readonly Mock<ILatestProductHistoryExistsValidator<ProductId>> _latestProductHistoryExistsByIdValidator;
    private readonly DeleteProductHandler _handler;
    private readonly Mock<IProductExistsValidator<ProductId>> _mockProductExistsValidator;

    public DeleteProductHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        _mockProductExistsValidator = new Mock<IProductExistsValidator<ProductId>>(); 
        _latestProductHistoryExistsByIdValidator = new Mock<ILatestProductHistoryExistsValidator<ProductId>>();

        _handler = new DeleteProductHandler(
            productRepository: _mockProductRepository.Object,
            productHistoryRepository: _mockProductHistoryRepository.Object,
            productExistsValidator: _mockProductExistsValidator.Object,
            latestProductHistoryExistsValidator: _latestProductHistoryExistsByIdValidator.Object
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
            id: mockProduct.Id.Value
        );

        // Product Exists
        SetupMockServices.SetupProductExistsValidatorSuccess(_mockProductExistsValidator, mockProduct.Id, mockProduct);

        // ProductHistory Exists
        SetupMockServices.SetupLatestProductHistoryExistsValidatorSuccess(_latestProductHistoryExistsByIdValidator, mockProduct.Id, mockProductHistory);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
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
            id: mockProduct.Id.Value
        );

        SetupMockServices.SetupProductExistsValidatorFailure(_mockProductExistsValidator);
       
        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        _mockProductExistsValidator.Verify(repo => repo.Validate(It.Is<ProductId>(id => id == mockProduct.Id)), Times.Once);
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
            id: mockProduct.Id.Value
        );

        SetupMockServices.SetupProductExistsValidatorSuccess(_mockProductExistsValidator, mockProduct.Id, mockProduct);
        SetupMockServices.SetupLatestProductHistoryExistsValidatorFailure(_latestProductHistoryExistsByIdValidator);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        _mockProductExistsValidator.Verify(validator => validator.Validate(It.Is<ProductId>(id => id == mockProduct.Id)), Times.Once);
        _latestProductHistoryExistsByIdValidator.Verify(validator => validator.Validate(mockProduct.Id), Times.Once);
    }
}