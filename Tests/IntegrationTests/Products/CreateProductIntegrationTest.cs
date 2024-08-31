using System.Net;
using System.Net.Http.Json;
using Application.Api.Products.Create.DTOs;

namespace Tests.IntegrationTests.Products;

public class CreateProductIntegrationTest : ProductsIntegrationTest
{
    [Fact]
    public async Task CreateProduct_ValidData_Success()
    {
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(new CreateProductRequestDTO(
            name: "Product #1"
        )));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CreateProductResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Product);
    }
}