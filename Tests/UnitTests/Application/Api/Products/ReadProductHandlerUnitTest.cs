using Application.Handlers.Products.Read;
using Application.Validators.ProductExistsValidator;
using Domain.ValueObjects.Product;
using Moq;
using Tests.UnitTests.Utils;

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
        SetupMockServices.SetupProductExistsValidatorSuccess(_mockProductExistsValidator, mockProduct.Id, mockProduct);

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
        SetupMockServices.SetupProductExistsValidatorFailure(_mockProductExistsValidator);
    
        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}