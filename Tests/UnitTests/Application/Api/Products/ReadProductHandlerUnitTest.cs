using Application.Handlers.Products.Read;
using Application.Interfaces.Persistence;
using Moq;

namespace Tests.UnitTests.Application.Api.Products;

public class ReadProductsHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly ReadProductHandler _handler;
    public ReadProductsHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _handler = new ReadProductHandler(
            productRepository: _mockProductRepository.Object
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

        var query = new ReadProductQuery(mockProduct.Id);

        _mockProductRepository.Setup(repo => repo.GetByIdAsync(mockProduct.Id)).ReturnsAsync(mockProduct);

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

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
    }
}