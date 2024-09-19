using System.Net;
using System.Net.Http.Json;
using Application.Api.Orders.Read.DTOs;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;

namespace Tests.IntegrationTests.Orders;

public class ReadOrderIntegrationTest : OrdersIntegrationTest
{
    private Product _product001 = null!;
    private Product _product002 = null!;
    private Order _order001 = null!;

    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = new Mixins(db);
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
        _product002 = await mixins.CreateProductAndProductHistory(number: 2, images: []);
        _order001 = await mixins.CreateOrder(
            products: new List<Product>() { _product001, _product002 },
            number: 1,
            orderStatus: OrderStatus.Pending,
            orderItemStatus: OrderItemStatus.Pending
        );
    }

    [Fact]
    public async Task ReadOrder_ValidId_Success()
    {
        var request = new ReadOrderRequestDTO();
        var response = await _client.GetAsync($"{_route}/{_order001.Id}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ReadOrderResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Order);
        Assert.NotEmpty(content.Order.OrderItems);
        Assert.True(content.Order.OrderItems.All(orderItem => orderItem.ProductHistory is not null));
    }

    [Fact]
    public async Task ReadOrder_NonExistingId_Failure()
    {
        var request = new ReadOrderRequestDTO();
        var response = await _client.GetAsync($"{_route}/10000");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ReadOrder_InvalidId_Failure()
    {
        var request = new ReadOrderRequestDTO();
        var response = await _client.GetAsync($"{_route}/Not_a_valid_id");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}