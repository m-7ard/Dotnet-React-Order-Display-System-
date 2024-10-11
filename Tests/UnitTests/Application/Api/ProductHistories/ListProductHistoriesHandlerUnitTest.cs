using Application.Api.ProductHistories.List.Handlers;
using Application.Interfaces.Persistence;
using Moq;

namespace Tests.UnitTests.Application.Api.ProductHistories;

public class ListProductHistoriesHandlerUnitTest
{
    private readonly Mock<IProductHistoryRepository> _mockProductHistoryRepository;
    private readonly ListProductHistoriesHandler _handler;

    public ListProductHistoriesHandlerUnitTest()
    {
        _mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        _handler = new ListProductHistoriesHandler(
            productHistoryRepository: _mockProductHistoryRepository.Object
        );
    }

    [Fact]
    public async Task ListProductHistories_NoArguments_Success()
    {
        // ARRANGE
        var query = new ListProductHistoriesQuery(
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validTo: null,
            validFrom: null,
            productId: null,
            orderBy: null
        );

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
        _mockProductHistoryRepository.Verify(repo => repo.FindAllAsync(
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
    [InlineData("newest", "ValidFrom", false)]
    [InlineData("oldest", "ValidFrom", true)]
    [InlineData("price desc", "Price", false)]
    [InlineData("price asc", "Price", true)]
    [InlineData("product id desc", "OriginalProductId", false)]
    [InlineData("product id asc", "OriginalProductId", true)]
    public async Task ListProductHistories_OrderByTranslation_Success(string orderBy, string expectedField, bool expectedAscending)
    {
        // ARRANGE
        var query = new ListProductHistoriesQuery(
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validTo: null,
            validFrom: null,
            productId: null,
            orderBy: orderBy
        );

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
        _mockProductHistoryRepository.Verify(repo => repo.FindAllAsync(
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