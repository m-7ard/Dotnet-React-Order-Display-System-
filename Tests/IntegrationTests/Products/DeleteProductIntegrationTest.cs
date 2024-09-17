using System.Net;
using System.Net.Http.Json;
using Application.Api.Products.Delete.DTOs;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.Products;

public class DeleteProductIntegrationTest : ProductsIntegrationTest
{
    private Product _product001 = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = new Mixins(db);
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
    }

    [Fact]
    public async Task DeleteProduct_ValidData_Success()
    {
        var request = new DeleteProductRequestDTO();
        var response = await _client.PostAsync($"{_route}/{_product001.Id}/delete", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var db = _factory.CreateDbContext();
        var product = await db.Product.SingleOrDefaultAsync(d => d.Id == _product001.Id);
        Assert.Null(product);
    }

    [Fact]
    public async Task DeleteProduct_NonExistingId_Failure()
    {
        var request = new DeleteProductRequestDTO();
        var response = await _client.PostAsync($"{_route}/10000/delete", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteProduct_InvalidId_Failure()
    {
        var request = new DeleteProductRequestDTO();
        var response = await _client.PostAsync($"{_route}/invalid/delete", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}