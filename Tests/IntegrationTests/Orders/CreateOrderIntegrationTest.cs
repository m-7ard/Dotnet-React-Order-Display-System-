using System.Net;
using System.Net.Http.Json;
using Application.Api.Orders.Create.DTOs;
using Application.Api.Orders.Create.Other;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;

namespace Tests.IntegrationTests.Orders;

public class CreateOrderIntegrationTest : OrdersIntegrationTest
{
    private Product _productOne = null!;
    private Product _productTwo = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = new Mixins(db);
        _productOne = await mixins.CreateProductAndProductHistory(number: 1, images: []);
        _productTwo = await mixins.CreateProductAndProductHistory(number: 2, images: []);
    }

    [Fact]
    public async Task CreateOrder_ValidData_Success()
    {
        var orderItemData = new Dictionary<string, OrderItemData>();
        orderItemData["product_1"] = new OrderItemData(
            productId: _productOne.Id,
            quantity: 1
        );
        orderItemData["product_2"] = new OrderItemData(
            productId: _productTwo.Id,
            quantity: 1
        );

        var request = new CreateOrderRequestDTO
        (
            orderItemData: orderItemData
        );
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CreateOrderResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Order);
        Assert.NotEmpty(content.Order.OrderItems);

        Assert.Equal(content.Order.Status, OrderStatus.Pending);
        Assert.StrictEqual(2, content.Order.OrderItems.Count);

        Assert.True(content.Order.OrderItems.All(item => item.Status == OrderItemStatus.Pending));
    }

    [Fact]
    public async Task CreateOrder_NonExistingProduct_Falure()
    {
        var orderItemData = new Dictionary<string, OrderItemData>();
        orderItemData["product_1"] = new OrderItemData(
            productId: 0,
            quantity: 1
        );

        var request = new CreateOrderRequestDTO
        (
            orderItemData: orderItemData
        );
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateOrder_InvalidOrderItemData_Falure()
    {
        var orderItemData = new Dictionary<string, OrderItemData>();
        orderItemData["product_1"] = new OrderItemData(
            productId: 1,
            quantity: 0
        );

        var request = new CreateOrderRequestDTO
        (
            orderItemData: orderItemData
        );
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}