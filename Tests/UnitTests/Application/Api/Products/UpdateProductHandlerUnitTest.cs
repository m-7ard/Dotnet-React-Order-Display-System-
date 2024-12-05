using Application.Handlers.Products.Update;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using Domain.Models;
using Moq;

namespace Tests.UnitTests.Application.Api.Products;

public class UpdateProductHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IDraftImageRepository> _mockDraftImageRepository;
    private readonly Mock<IProductHistoryRepository> _mockProductHistoryRepository;
    private readonly UpdateProductHandler _handler;
    public UpdateProductHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockDraftImageRepository = new Mock<IDraftImageRepository>();
        _mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        
        _handler = new UpdateProductHandler(
            productRepository: _mockProductRepository.Object,
            draftImageRepository: _mockDraftImageRepository.Object,
            productHistoryRepository: _mockProductHistoryRepository.Object
        );
    }

    [Fact]
    public async Task UpdateProduct_NoImages_Success()
    {
        // ARRANGE
        var oldMockProduct = Mixins.CreateProduct(
            seed: 1,
            images: []
        );

        var newMockProduct = ProductFactory.BuildExistingProduct(
            id: oldMockProduct.Id,
            name: "Product 1 Updated",
            price: 100,
            description: "description updated",
            images: oldMockProduct.Images,
            dateCreated: oldMockProduct.DateCreated
        );

        var query = new UpdateProductCommand(
            id: newMockProduct.Id,
            name: newMockProduct.Name,
            price: newMockProduct.Price,
            description: newMockProduct.Description,
            images: []
        );

        var oldMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(oldMockProduct);
        var newMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(newMockProduct);

        _mockProductRepository.Setup(repo => repo.GetByIdAsync(oldMockProduct.Id)).ReturnsAsync(oldMockProduct);
        _mockProductHistoryRepository.Setup(repo => repo.GetLatestByProductIdAsync(oldMockProduct.Id)).ReturnsAsync(oldMockProductHistory);

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
        _mockProductRepository.Verify(repo => repo.UpdateAsync(It.Is<Product>(d => d.Name == newMockProduct.Name)), Times.Once);
        _mockProductHistoryRepository.Verify(repo => repo.UpdateAsync(It.Is<ProductHistory>(d => d.ValidTo > d.ValidFrom)), Times.Once);
        _mockProductHistoryRepository.Verify(repo => repo.CreateAsync(It.Is<ProductHistory>(d => d.Name == newMockProductHistory.Name)), Times.Once);
    }

    [Fact]
    public async Task UpdateProduct_WithImages_Success()
    {
        // ARRANGE
        var deleteProductImage = ProductImageFactory.BuildExistingProductImage(id: Guid.NewGuid(), fileName: "file-1", originalFileName: "abc", url: "url", dateCreated: new DateTime(), productId: Guid.NewGuid());
        var keepProductImage = ProductImageFactory.BuildExistingProductImage(id: Guid.NewGuid(), fileName: "file-2", originalFileName: "abc", url: "url", dateCreated: new DateTime(), productId: Guid.NewGuid());
        var newProductImage = ProductImageFactory.BuildExistingProductImage(id: Guid.NewGuid(), fileName: "file-3", originalFileName: "abc", url: "url", dateCreated: new DateTime(), productId: Guid.NewGuid());

        var oldMockProduct = Mixins.CreateProduct(
            seed: 1,
            images: [deleteProductImage, keepProductImage]
        );

        var newMockProduct = ProductFactory.BuildExistingProduct(
            id: oldMockProduct.Id,
            name: "Product 1 Updated",
            price: 100,
            description: "description updated",
            images: [keepProductImage, newProductImage],
            dateCreated: oldMockProduct.DateCreated
        );

        var query = new UpdateProductCommand(
            id: newMockProduct.Id,
            name: newMockProduct.Name,
            price: newMockProduct.Price,
            description: newMockProduct.Description,
            images: newMockProduct.Images.Select(image => image.FileName).ToList()
        );

        var oldMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(oldMockProduct);
        var newMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(newMockProduct);

        _mockProductRepository
            .Setup(repo => repo.GetByIdAsync(oldMockProduct.Id))
            .ReturnsAsync(oldMockProduct);

        _mockProductHistoryRepository
            .Setup(repo => repo.GetLatestByProductIdAsync(oldMockProduct.Id))
            .ReturnsAsync(oldMockProductHistory);

        _mockDraftImageRepository
            .Setup(repo => repo.GetByFileNameAsync(newProductImage.FileName))
            .ReturnsAsync(DraftImageFactory.BuildNewDraftImage(
                fileName: newProductImage.FileName,
                originalFileName: newProductImage.OriginalFileName,
                url: newProductImage.Url
            ));

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);

        // new ProductImage should have draft deleted
        _mockDraftImageRepository.Verify(repo => repo.DeleteByFileNameAsync(newProductImage.FileName), Times.Once);
        
        // new ProductImage should be present at time of updating
        _mockProductRepository.Verify(repo => repo.UpdateAsync(It.Is<Product>(d => 
            d.Images
            .Select(image => image.FileName)
            .Contains(newProductImage.FileName)) 
        ), Times.Once);

        // old ProductImage should not be present at time of updating
        _mockProductRepository.Verify(repo => repo.UpdateAsync(It.Is<Product>(d => 
            !d.Images
            .Select(image => image.FileName)
            .Contains(deleteProductImage.FileName)) 
        ), Times.Once);
    }
}