using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Products.Update;
using Domain.Models;
using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.Products;

[Collection("Sequential")]
public class UpdateProductIntegrationTest : ProductsIntegrationTest
{
    private DraftImage _validImage = null!;
    private Product _product001 = null!;
    private ProductHistoryDbEntity _product001History = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = new Mixins(db);
        _validImage = await mixins.CreateDraftImage(
            fileRoute: TestFileRoute.ValidImage,
            destinationFileName: "saved-valid-image"
        );
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: [_validImage]);
        _product001History = await db.ProductHistory.SingleAsync(d => d.Id == _product001.Id);
    }

    [Fact]
    public async Task UpdateProduct_ValidData_Success()
    {
        var request = new UpdateProductRequestDTO
        (
            name: "Product #1 Updated",
            price: (decimal)123.99,
            description: "description Updated",
            images: new List<string>() { _validImage.FileName }
        );
        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<UpdateProductResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Product);
        Assert.StrictEqual(1, content.Product.Images.Count);

        var db = _factory.CreateDbContext();
        var productHistories = await db.ProductHistory.ToListAsync();
        Assert.StrictEqual(2, productHistories.Count);

        var updatedProductHistory = await db.ProductHistory.SingleAsync(d => d.Id == _product001History.Id);
        Assert.True(updatedProductHistory.ValidTo > updatedProductHistory.ValidFrom);        
    }

    [Fact]
    public async Task UpdateProduct_InvalidData_Failure()
    {
        var request = new UpdateProductRequestDTO
        (
            name: "Product #1 Updated",
            price: -100,
            description: "description Updated",
            images: new List<string>() { _validImage.FileName }
        );
        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateProduct_InvalidId_Failure()
    {
        var request = new UpdateProductRequestDTO
        (
            name: "Product #1 Updated",
            price: 100,
            description: "description Updated",
            images: new List<string>() { _validImage.FileName }
        );
        var response = await _client.PutAsync($"{_route}/1000/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateProduct_ValidDataAndRemoveImage_Success()
    {
        var request = new UpdateProductRequestDTO
        (
            name: "Product #1 Updated",
            price: 100,
            description: "description Updated",
            images: new List<string>() {}
        );
        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Check Image model was deleted
        var db = _factory.CreateDbContext();
        var productImage = await db.ProductImage.SingleOrDefaultAsync(d => d.Id == _validImage.Id);
        Assert.Null(productImage);
    }
}