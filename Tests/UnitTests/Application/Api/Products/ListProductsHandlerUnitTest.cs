using Application.Api.Products.List.Handlers;
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
        var mockProduct = ProductFactory.BuildExistingProduct(
            id: 100,
            name: "Product 1",
            price: 1,
            description: "description",
            images: [],
            dateCreated: new DateTime()
        );

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
}