using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Orders.List;
using Application.Common;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.Orders;

[Collection("Sequential")]
public class ListOrdersIntegrationTest : OrdersIntegrationTest
{
    private Product _product001 = null!;
    private Product _product002 = null!;
    private Product _product003 = null!;
    private Order _order001 = null!;
    private Order _order002 = null!;
    private Order _order003 = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = new Mixins(db);
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
        _product002 = await mixins.CreateProductAndProductHistory(number: 2, images: []);
        _product003 = await mixins.CreateProductAndProductHistory(number: 3, images: []);
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
        _order003 = await mixins.CreateOrder(
            products: new List<Product>() { _product003 },
            number: 100,
            orderStatus: OrderStatus.Pending,
            orderItemStatus: OrderItemStatus.Pending
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
               createdAfter: null,
               id: null,
               productId: null,
               productHistoryId: null,
               orderBy: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(3, content.Orders.Count);
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
               createdAfter: null,
               id: null,
               productId: null,
               productHistoryId: null,
               orderBy: null
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
               createdAfter: null,
               id: null,
               productId: null,
               productHistoryId: null,
               orderBy: null
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
               createdAfter: null,
               id: null,
               productId: null,
               productHistoryId: null,
               orderBy: null
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
    public async Task ListAllOrders_ValidId_Success()
    {
        var request = new ListOrdersRequestDTO
        (
               minTotal: null,
               maxTotal: null,
               status: null,
               createdBefore: null,
               createdAfter: null,
               id: _order001.Id,
               productId: null,
               productHistoryId: null,
               orderBy: null
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
    public async Task ListAllOrders_ValidProductId_Success()
    {
        var request = new ListOrdersRequestDTO
        (
               minTotal: null,
               maxTotal: null,
               status: null,
               createdBefore: null,
               createdAfter: null,
               id: null,
               productId: _product001.Id,
               productHistoryId: null,
               orderBy: null
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
    public async Task ListAllOrders_ValidProductHistoryId_Success()
    {
        var db = _factory.CreateDbContext();
        var product001History = await db.ProductHistory.SingleAsync(d => d.ProductId == _product001.Id);
        var request = new ListOrdersRequestDTO
        (
               minTotal: null,
               maxTotal: null,
               status: null,
               createdBefore: null,
               createdAfter: null,
               id: null,
               productId: null,
               productHistoryId: product001History.Id,
               orderBy: null
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
    public async Task ListAllOrders_OrderByNewest_Success()
    {
        var request = new ListOrdersRequestDTO
        (
               minTotal: null,
               maxTotal: null,
               status: null,
               createdBefore: null,
               createdAfter: null,
               id: null,
               productId: null,
               productHistoryId: null,
               orderBy: "newest"
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);

        Assert.StrictEqual(_order003.Id, content.Orders[0].Id);
        Assert.StrictEqual(_order002.Id, content.Orders[1].Id);
        Assert.StrictEqual(_order001.Id, content.Orders[2].Id);
    }

    [Fact]
    public async Task ListAllOrders_OrderByOldest_Success()
    {
        var request = new ListOrdersRequestDTO
        (
               minTotal: null,
               maxTotal: null,
               status: null,
               createdBefore: null,
               createdAfter: null,
               id: null,
               productId: null,
               productHistoryId: null,
               orderBy: "oldest"
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);

        Assert.StrictEqual(_order003.Id, content.Orders[2].Id);
        Assert.StrictEqual(_order002.Id, content.Orders[1].Id);
        Assert.StrictEqual(_order001.Id, content.Orders[0].Id);
    }
}
