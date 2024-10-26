using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Orders.MarkFinished;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Infrastructure.DbEntities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Tests.IntegrationTests.OrderItems;

namespace Tests.IntegrationTests.Orders;

[Collection("Sequential")]
public class ChangeOrderStatusIntegrationTest : OrderItemsIntegrationTest
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
    public async Task MarkOrderFinished_ValidData_Success()
    {
        var db = _factory.CreateDbContext();
        var repo = new OrderRepository(db);
        foreach (var orderItem in _order001.OrderItems)
        {
            _order001.UpdateOrderItemStatus(orderItemId: orderItem.Id, OrderItemStatus.Finished);
        }
        await repo.UpdateAsync(_order001);

        var request = new MarkOrderFinishedRequestDTO();
        var response = await _client.PutAsync($"{_route}/{_order001.Id}/mark_finished", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<MarkOrderFinishedResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Order);

        // Confirm it was updated
        var persistedOrder = await _factory.CreateDbContext().Order.SingleAsync(d => d.Id == _order001.Id)!;
        Assert.Equal(OrderDbEntity.Statuses.Finished, persistedOrder.Status);
    }

    [Fact]
    public async Task MarkOrderFinished_NonExistingOrder_Failure()
    {
        var request = new MarkOrderFinishedRequestDTO();
        var response = await _client.PutAsync($"{_route}/100000000/mark_finished", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task MarkOrderFinished_ChangeNotAllowed_Failure()
    {
        var db = _factory.CreateDbContext();
        var repo = new OrderRepository(db);
        _order001.UpdateStatus(OrderStatus.Finished);
        await repo.UpdateAsync(_order001);

        var request = new MarkOrderFinishedRequestDTO();
        var response = await _client.PutAsync($"{_route}/{_order001.Id}/mark_finished", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
