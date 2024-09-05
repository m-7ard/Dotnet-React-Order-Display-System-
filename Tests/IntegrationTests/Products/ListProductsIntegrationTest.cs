using System.Net;
using System.Net.Http.Json;
using Application.Api.Products.Create.DTOs;
using Application.Api.Products.List.DTOs;
using Domain.Models;
using Infrastructure.HttpQueryStrings;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.Products;

public class ListProductsIntegrationTest : ProductsIntegrationTest
{
    private Product _price1_NameDescProduct1 = null!;
    private Product _price2_NameDescProduct2 = null!;
    private Product _price3_NameDescProduct3 = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = new Mixins(db);
        _price1_NameDescProduct1 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
        Task.Delay(1000).Wait();
        _price2_NameDescProduct2 = await mixins.CreateProductAndProductHistory(number: 2, images: []);
        Task.Delay(1000).Wait();
        _price3_NameDescProduct3 = await mixins.CreateProductAndProductHistory(number: 3, images: []);
    }

    [Fact]
    public async Task ListAllProduct_NoParameters_Success()
    {
        var request = new ListProductsRequestDTO
        (
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null
        );
        var queryString = HttpQueryStrings.ToQueryString(request);
        var response = await _client.GetAsync($"{_route}/list{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(3, content.Products.Count);
    }

    [Fact]
    public async Task ListAllProduct_Price2OrMore_Success()
    {
        var request = new ListProductsRequestDTO
        (
            name: null,
            minPrice: 2,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null
        );
        var queryString = HttpQueryStrings.ToQueryString(request);
        var response = await _client.GetAsync($"{_route}/list{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(2, content.Products.Count);
    }

    [Fact]
    public async Task ListAllProduct_NameContains1_Success()
    {
        var request = new ListProductsRequestDTO
        (
            name: "1",
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null
        );
        var queryString = HttpQueryStrings.ToQueryString(request);
        var response = await _client.GetAsync($"{_route}/list{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(1, content.Products.Count);
    }

    [Fact]
    public async Task ListAllProduct_CreatedBeforeProduct2_Success()
    {
        // The reason why we don't use it with HttpQueryStrings is that
        // dates will not be in ISO format.
        var createdBefore = _price2_NameDescProduct2.DateCreated.ToString("o");
        var response = await _client.GetAsync($"{_route}/list?createdBefore={createdBefore}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(2, content.Products.Count);
    }
}