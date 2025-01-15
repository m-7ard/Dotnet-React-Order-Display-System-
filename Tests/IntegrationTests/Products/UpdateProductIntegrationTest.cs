using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Products.Update;
using Domain.Models;
using Infrastructure.DbEntities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.Products;

[Collection("Sequential")]
public class UpdateProductIntegrationTest : ProductsIntegrationTest
{
    private DraftImage _validImage = null!;
    private Product _product001 = null!;
    private ProductHistoryDbEntity _product001History = null!;
    private UpdateProductRequestDTO DefaultRequest = null!;

    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = new Mixins(db);
        _validImage = await mixins.CreateDraftImage(
            fileRoute: TestFileRoute.ValidImage,
            destinationFileName: "saved-valid-image.png"
        );
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: [_validImage]);
        _product001History = await db.ProductHistory.SingleAsync(d => d.ProductId == _product001.Id.Value);
        DefaultRequest = new UpdateProductRequestDTO(
            name: "Product #1 Updated",
            price: (decimal)123.99,
            description: "description Updated",
            images: new List<string>() { _validImage.FileName }
        );
    }

    [Fact]
    public async Task UpdateProduct_ValidDataAndSameImages_Success()
    {
        var request = DefaultRequest;
        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<UpdateProductResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Id);

        var db = _factory.CreateDbContext();
        var productHistories = await db.ProductHistory.ToListAsync();
        Assert.StrictEqual(2, productHistories.Count);

        var updatedProductHistory = await db.ProductHistory.SingleAsync(d => d.Id == _product001History.Id);
        Assert.True(updatedProductHistory.ValidTo > updatedProductHistory.ValidFrom);        
    }

    [Fact]
    public async Task UpdateProduct_ValidDataAndNewImage_Success()
    {
        var mixins = GetMixins();
        var newValidImage = await mixins.CreateDraftImage(
            fileRoute: TestFileRoute.ValidImage,
            destinationFileName: "new-valid-image.png"
        );
        
        var request = DefaultRequest;
        request.Images = new List<string>(){ _validImage.FileName, newValidImage.FileName };

        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var db = _factory.CreateDbContext();
        var repo = new ProductRepository(db);
        var product = (await repo.GetByIdAsync(_product001.Id))!;
        Assert.Equal(2, product.Images.Count);
    }

    [Fact]
    public async Task UpdateProduct_ValidDataAndNewImageAndRemoveOldImage_Success()
    {
        var mixins = GetMixins();
        var newValidImage = await mixins.CreateDraftImage(
            fileRoute: TestFileRoute.ValidImage,
            destinationFileName: "new-valid-image.png"
        );
        
        var request = DefaultRequest;
        request.Images = new List<string>(){ newValidImage.FileName };

        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var db = _factory.CreateDbContext();
        var repo = new ProductRepository(db);
        var product = (await repo.GetByIdAsync(_product001.Id))!;
        Assert.StrictEqual(1, product.Images.Count);
        Assert.Equal(product.Images[0].FileName, newValidImage.FileName);
    }

    [Fact]
    public async Task UpdateProduct_InvalidData_Failure()
    {
        var request = DefaultRequest;
        request.Price = -100;

        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateProduct_InvalidId_Failure()
    {
        var request = DefaultRequest;
        var response = await _client.PutAsync($"{_route}/1000/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateProduct_ValidDataAndRemoveImage_Success()
    {
        var request = DefaultRequest;
        request.Images = new List<string>();

        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Check Image model was deleted
        var db = _factory.CreateDbContext();
        var productImage = await db.ProductImage.ToListAsync();
        Assert.True(productImage.Count == 0);
    }
}