using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Products.Create;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.Products;

[Collection("Sequential")]
public class CreateProductIntegrationTest : ProductsIntegrationTest
{
    private DraftImage _validImage = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = new Mixins(db);
        _validImage = await mixins.CreateDraftImage(
            fileRoute: TestFileRoute.ValidImage,
            destinationFileName: "saved-valid-image"
        );
    }

    [Fact]
    public async Task CreateProduct_WithoutImages_Success()
    {
        var request = new CreateProductRequestDTO
        (
            name: "Product #1",
            price: (decimal)1.1,
            description: "description",
            images: new List<string>()
        );
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CreateProductResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Product);

        var db = _factory.CreateDbContext();
        var productHistories = await db.ProductHistory.ToListAsync();
        Assert.StrictEqual(1, productHistories.Count);
        Assert.StrictEqual(content.Product.Id, productHistories[0].ProductId);
    }

    [Fact]
    public async Task CreateMenuItem_WithImages_Success()
    {
        var images = new List<string>(){ _validImage.FileName };
        var request = new CreateProductRequestDTO(
            name: "MenuItem #1",
            price: (decimal)123.12,
            description: "description",
            images: images
        );
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));
    
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var responseContent = await response.Content.ReadFromJsonAsync<CreateProductResponseDTO>();
        Assert.NotNull(responseContent);
        Assert.NotNull(responseContent.Product);
        Assert.NotEmpty(responseContent.Product.Images);
    }

    [Fact]
    public async Task CreateMenuItem_TooManyImages_Failure()
    {
        var images = new List<string>();
        for (var i = 0; i < 9; i++)
        {
            images.Add(_validImage.FileName);
        }

        var request = new CreateProductRequestDTO(
            name: "MenuItem #1",
            price: (decimal)123.12,
            description: "description",
            images: images
        );

        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));
    
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateMenuItem_NonExistingImage_Failure()
    {
        var images = new List<string>() { "non-existing-image-jpg" };
        var request = new CreateProductRequestDTO(
            name: "MenuItem #1",
            price: (decimal)123.12,
            description: "description",
            images: images
        );

        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));
    
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}