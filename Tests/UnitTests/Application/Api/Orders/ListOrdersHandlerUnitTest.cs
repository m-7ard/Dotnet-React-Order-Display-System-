using Application.Contracts.Criteria;
using Application.Handlers.Orders.List;
using Application.Interfaces.Persistence;
using Moq;

namespace Tests.UnitTests.Application.Api.Orders;

public class ListOrdersHandlerUnitTest
{
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly ListOrdersHandler _handler;

    public ListOrdersHandlerUnitTest()
    {
        _mockOrderRepository = new Mock<IOrderRepository>();
        _handler = new ListOrdersHandler(
            orderRepository: _mockOrderRepository.Object
        );
    }

    [Fact]
    public async Task ListOrders_NoArgs_Success()
    {
        // ARRANGE
        var command = new ListOrdersQuery(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        var criteria = new FilterOrdersCriteria(
            minTotal: null,
            maxTotal: null,
            status: null,
            createdBefore: null,
            createdAfter: null,
            productId: null,
            id: null,
            productHistoryId: null,
            orderBy: new Tuple<string, bool>("DateCreated", false)
        );
        Assert.True(result.IsT0);
        _mockOrderRepository.Verify(
            repo => repo.FilterAllAsync(criteria)
        );
    }

    [Theory]
    [InlineData("newest", "DateCreated", false)]
    [InlineData("oldest", "DateCreated", true)]
    [InlineData("total desc", "Total", false)]
    [InlineData("total asc", "Total", true)]
    public async Task ListOrders_OrderByTranslation_Success(string orderBy, string expectedField, bool expectedAscending)
    {
        // ARRANGE
        var query = new ListOrdersQuery(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            orderBy
        );

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        var criteria = new FilterOrdersCriteria(
            minTotal: null,
            maxTotal: null,
            status: null,
            createdBefore: null,
            createdAfter: null,
            productId: null,
            id: null,
            productHistoryId: null,
            orderBy: new Tuple<string, bool>(expectedField, expectedAscending)
        );
        Assert.True(result.IsT0);
        _mockOrderRepository.Verify(
            repo => repo.FilterAllAsync(criteria)
        );
    }
}