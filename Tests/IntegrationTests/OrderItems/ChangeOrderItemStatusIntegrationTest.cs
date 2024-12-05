using System.Net;
using System.Net.Http.Json;
using Api.DTOs.OrderItems.MarkFinished;
using Domain.Models;
using Domain.ValueObjects.Order;
using Infrastructure.DbEntities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.OrderItems;

[Collection("Sequential")]
public class ChangeOrderItemStatusIntegrationTest : OrderItemsIntegrationTest
{
    private Product _product001 = null!;
    private Product _product002 = null!;
    private Order _order001 = null!;
    private OrderItem _orderItem001 = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = new Mixins(db);
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
        _product002 = await mixins.CreateProductAndProductHistory(number: 2, images: []);
        _order001 = await mixins.CreateOrder(
            products: new List<Product>() { _product001, _product002 },
            orderStatus: OrderStatus.Pending,
            seed: 1
        );
        _orderItem001 = _order001.OrderItems.Find(orderItem => orderItem.ProductId == _product001.Id)!; 
    }

    [Fact]
    public async Task MarkOrderItemFinished_ValidData_Success()
    {
        var request = new MarkOrderItemFinishedRequestDTO();
        var response = await _client.PutAsync($"{_route}/{_order001.Id}/item/{_orderItem001.Id}/mark_finished", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<MarkOrderItemFinishedResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.OrderId);
        Assert.NotNull(content.OrderItemId);
        
        var db = _factory.CreateDbContext();
        var persistedOrderItem = await db.OrderItem.SingleAsync(d => d.Id.ToString() == content.OrderItemId);
        Assert.Equal(OrderItemDbEntity.Statuses.Finished, persistedOrderItem.Status);
    }

    [Fact]
    public async Task MarkOrderItemFinished_NonExistingOrder_Failure()
    {
        var request = new MarkOrderItemFinishedRequestDTO();
        var response = await _client.PutAsync($"{_route}/100000000/item/{_orderItem001.Id}/mark_finished", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task MarkOrderItemFinished_ChangeNotAllowed_Failure()
    {
        var db = _factory.CreateDbContext();
        var repo = new OrderRepository(db);
        _order001.TryMarkOrderItemFinished(orderItemId: _orderItem001.Id);
        await repo.UpdateAsync(_order001);

        var request = new MarkOrderItemFinishedRequestDTO();
        var response = await _client.PutAsync($"{_route}/{_order001.Id}/item/{_orderItem001.Id}/mark_finished", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
