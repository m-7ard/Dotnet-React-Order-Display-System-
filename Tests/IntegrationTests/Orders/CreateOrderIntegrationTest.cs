using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Orders.Create;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Infrastructure.DbEntities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.Orders;

[Collection("Sequential")]
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
        var orderItemData = new Dictionary<string, CreateOrderRequestDTO.OrderItem>();
        orderItemData["product_1"] = new CreateOrderRequestDTO.OrderItem(
            productId: _productOne.Id,
            quantity: 1
        );
        orderItemData["product_2"] = new CreateOrderRequestDTO.OrderItem(
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
        Assert.NotNull(content.OrderId);

        var isValidGuid = Guid.TryParse(content.OrderId, out var parsedId);
        Assert.True(isValidGuid);

        var repo = new OrderRepository(_factory.CreateDbContext());
        var order = await repo.GetByIdAsync(parsedId);
        Assert.NotNull(order);
        Assert.NotEmpty(order.OrderItems);

        Assert.Equal(OrderStatus.Pending, order.Status);
        Assert.StrictEqual(2, order.OrderItems.Count);

        Assert.True(order.OrderItems.All(item => item.Status == OrderItemStatus.Pending));
    }

    [Fact]
    public async Task CreateOrder_EmptyOrderItemData_Falure()
    {
        var orderItemData = new Dictionary<string, CreateOrderRequestDTO.OrderItem>();

        var request = new CreateOrderRequestDTO
        (
            orderItemData: orderItemData
        );
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateOrder_NonExistingProduct_Falure()
    {
        var orderItemData = new Dictionary<string, CreateOrderRequestDTO.OrderItem>();
        orderItemData["product_1"] = new CreateOrderRequestDTO.OrderItem(
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
        var orderItemData = new Dictionary<string, CreateOrderRequestDTO.OrderItem>();
        orderItemData["product_1"] = new CreateOrderRequestDTO.OrderItem(
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