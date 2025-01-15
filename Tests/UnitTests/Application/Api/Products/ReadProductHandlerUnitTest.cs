using Application.Errors;
using Application.Handlers.Products.Read;
using Application.Interfaces.Persistence;
using Application.Validators;
using Application.Validators.ProductExistsValidator;
using Domain.Models;
using Domain.ValueObjects.Product;
using Moq;
using OneOf;

namespace Tests.UnitTests.Application.Api.Products;

public class ReadProductsHandlerUnitTest
{
    private readonly ReadProductHandler _handler;
    private readonly Mock<IProductExistsValidator<ProductId>> _mockProductExistsValidator;

    public ReadProductsHandlerUnitTest()
    {
        _mockProductExistsValidator = new Mock<IProductExistsValidator<ProductId>>(); 

        _handler = new ReadProductHandler(
            productExistsValidator: _mockProductExistsValidator.Object
        );
    }

    [Fact]
    public async Task ReadProduct_ValidData_Success()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: []
        );

        var query = new ReadProductQuery(mockProduct.Id.Value);

        _mockProductExistsValidator
            .Setup(validator => validator.Validate(It.Is<ProductId>(id => id.Value == mockProduct.Id.Value)))
            .ReturnsAsync(OneOf<Product, List<ApplicationError>>.FromT0(mockProduct));

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task ReadProduct_ProductDoesNotExist_Failure()
    {
        // ARRANGE
        var query = new ReadProductQuery(Guid.Empty);
        _mockProductExistsValidator
            .Setup(validator => validator.Validate(It.IsAny<ProductId>()))
            .ReturnsAsync(OneOf<Product, List<ApplicationError>>.FromT1([]));

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}