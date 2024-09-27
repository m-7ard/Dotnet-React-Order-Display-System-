using System.Net;
using System.Net.Http.Json;
using Application.Api.Orders.List.DTOs;
using Application.Common;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;

namespace Tests.IntegrationTests.Orders;

public class ListOrdersIntegrationTest : OrdersIntegrationTest
{
    private Product _product001 = null!;
    private Product _product002 = null!;
    private Order _order001 = null!;
    private Order _order002 = null!;
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
        _order002 = await mixins.CreateOrder(
            products: new List<Product>() { _product001, _product002 },
            number: 10,
            orderStatus: OrderStatus.Finished,
            orderItemStatus: OrderItemStatus.Finished
        );
    }

    [Fact]
    public async Task ListAllOrders_NoParameters_Success()
    {
        var request = new ListOrdersRequestDTO
        (
               minTotal: null,
               maxTotal: null,
               status: null,
               createdBefore: null,
               createdAfter: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(2, content.Orders.Count);
    }

    [Fact]
    public async Task ListAllOrders_MaxTotal_Success()
    {
        var request = new ListOrdersRequestDTO
        (
               minTotal: null,
               maxTotal: _order001.Total,
               status: null,
               createdBefore: null,
               createdAfter: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(1, content.Orders.Count);
    }

    [Fact]
    public async Task ListAllOrders_CreatedBefore_Success()
    {
        var request = new ListOrdersRequestDTO
        (
               minTotal: null,
               maxTotal: null,
               status: null,
               createdBefore: _order001.DateCreated,
               createdAfter: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(1, content.Orders.Count);
    }

        [Fact]
    public async Task ListAllOrders_ValidStatus_Success()
    {
        var request = new ListOrdersRequestDTO
        (
               minTotal: null,
               maxTotal: null,
               status: OrderStatus.Finished.Name,
               createdBefore: null,
               createdAfter: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(1, content.Orders.Count);
    }
}
