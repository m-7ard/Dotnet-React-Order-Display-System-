using Application.Handlers.Products.List;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Moq;

namespace Tests.UnitTests.Application.Api.Products;

public class ListProductsHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly ListProductsHandler _handler;

    public ListProductsHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _handler = new ListProductsHandler(
            productRepository: _mockProductRepository.Object
        );
    }

    [Fact]
    public async Task ListProduct_NoArguments_Success()
    {
        // ARRANGE
        var query = new ListProductsQuery(
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
            orderBy: null
        );

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
        _mockProductRepository.Verify(repo => repo.FindAllAsync(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                new Tuple<string, bool>("DateCreated", false)
            )
        );
    }

    [Theory]
    [InlineData("newest", "DateCreated", false)]
    [InlineData("oldest", "DateCreated", true)]
    [InlineData("price desc", "Price", false)]
    [InlineData("price asc", "Price", true)]
    public async Task ListProduct_OrderByTranslation_Success(string orderBy, string expectedField, bool expectedAscending)
    {
        // ARRANGE
        var query = new ListProductsQuery(
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
            orderBy: orderBy
        );

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
        _mockProductRepository.Verify(repo => repo.FindAllAsync(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                new Tuple<string, bool>(expectedField, expectedAscending)
            )
        );
    }
}