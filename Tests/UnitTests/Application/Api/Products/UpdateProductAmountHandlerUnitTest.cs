using Application.Errors.Objects;
using Application.Handlers.Products.UpdateAmount;
using Application.Interfaces.Persistence;
using Application.Validators.ProductExistsValidator;
using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.Shared;
using Moq;
using Tests.UnitTests.Utils;

namespace Tests.UnitTests.Application.Api.Products;

public class UpdateProductAmountHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IProductExistsValidator<ProductId>> _mockProductExistsValidator;
    private readonly UpdateProductAmountHandler _handler;
    private readonly Product _PRODUCT_001;
    private readonly Quantity _PRODUCT_001_ORIGINAL_AMOUNT;

    public UpdateProductAmountHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockProductExistsValidator = new Mock<IProductExistsValidator<ProductId>>(); 
        _PRODUCT_001 = Mixins.CreateProduct(seed: 1, images: []);
        _PRODUCT_001_ORIGINAL_AMOUNT = _PRODUCT_001.Amount;
        
        _handler = new UpdateProductAmountHandler(
            productRepository: _mockProductRepository.Object,
            productExistsValidator: _mockProductExistsValidator.Object
        );
    }

    [Fact]
    public async Task UpdateProductAmount_ValidData_Success()
    {
        // ARRANGE
        var command = new UpdateProductAmountCommand(
            id: _PRODUCT_001.Id.Value,
            amount: _PRODUCT_001.Amount.Value + 1
        );

        SetupMockServices.SetupProductExistsValidatorSuccess(_mockProductExistsValidator, _PRODUCT_001.Id, _PRODUCT_001);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
        _mockProductRepository.Verify(repo => repo.UpdateAsync(It.Is<Product>(d => d.Amount.Value == _PRODUCT_001_ORIGINAL_AMOUNT.Value + 1)), Times.Once);
    }

    [Fact]
    public async Task UpdateProductAmount_InvalidAmount_Failure()
    {
        // ARRANGE
        var command = new UpdateProductAmountCommand(
            id: _PRODUCT_001.Id.Value,
            amount: -1
        );

        SetupMockServices.SetupProductExistsValidatorSuccess(_mockProductExistsValidator, _PRODUCT_001.Id, _PRODUCT_001);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotUpdateProductError>(result.AsT1.First());
    }
}