using System.Net;
using System.Net.Http.Json;
using Application.Api.Products.List.DTOs;
using Application.Common;
using Domain.Models;

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
        _price2_NameDescProduct2 = await mixins.CreateProductAndProductHistory(number: 2, images: []);
        _price3_NameDescProduct3 = await mixins.CreateProductAndProductHistory(number: 3, images: []);
    }

    [Fact]
    public async Task ListAllProduct_NoParameters_Success()
    {
        var request = new ListProductsRequestDTO
        (
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

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
            id: null,
            name: null,
            minPrice: 2,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

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
            id: null,
            name: "1",
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

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
            var request = new ListProductsRequestDTO
        (
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: _price2_NameDescProduct2.DateCreated,
            createdAfter: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(2, content.Products.Count);
    }
}