using Application.Errors;
using Application.Handlers.Products.Update;
using Application.Interfaces.Persistence;
using Application.Validators;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Product;
using Moq;
using OneOf;

namespace Tests.UnitTests.Application.Api.Products;

public class UpdateProductHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IDraftImageRepository> _mockDraftImageRepository;
    private readonly Mock<IProductHistoryRepository> _mockProductHistoryRepository;
    private readonly Mock<ILatestProductHistoryExistsValidator<ProductId>> _latestProductHistoryExistsByIdValidator;
    private readonly UpdateProductHandler _handler;
    private readonly Mock<IProductExistsValidator<ProductId>> _mockProductExistsValidator;

    public UpdateProductHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockDraftImageRepository = new Mock<IDraftImageRepository>();
        _mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        _mockProductExistsValidator = new Mock<IProductExistsValidator<ProductId>>(); 
        _latestProductHistoryExistsByIdValidator = new Mock<ILatestProductHistoryExistsValidator<ProductId>>();
        
        _handler = new UpdateProductHandler(
            productRepository: _mockProductRepository.Object,
            draftImageRepository: _mockDraftImageRepository.Object,
            productHistoryRepository: _mockProductHistoryRepository.Object,
            productExistsValidator: _mockProductExistsValidator.Object,
            latestProductHistoryExistsValidator: _latestProductHistoryExistsByIdValidator.Object,
            draftImageExistsValidator: new DraftImageExistsValidatorAsync(_mockDraftImageRepository.Object)
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
            id: newMockProduct.Id.Value,
            name: newMockProduct.Name,
            price: newMockProduct.Price,
            description: newMockProduct.Description,
            images: []
        );

        var oldMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(oldMockProduct);
        var newMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(newMockProduct);

        _mockProductExistsValidator
            .Setup(validator => validator.Validate(It.Is<ProductId>(id => id == oldMockProduct.Id)))
            .ReturnsAsync(OneOf<Product, List<ApplicationError>>.FromT0(oldMockProduct));

        _latestProductHistoryExistsByIdValidator
            .Setup(validator => validator.Validate(It.Is<ProductId>(id => id == oldMockProduct.Id)))
            .ReturnsAsync(oldMockProductHistory);

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
        var deleteProductImage = ProductImageFactory.BuildExistingProductImage(id: Guid.NewGuid(), fileName: "file-1.png", originalFileName: "abc.png", url: "url/file-1.png", dateCreated: new DateTime(), productId: Guid.NewGuid());
        var keepProductImage = ProductImageFactory.BuildExistingProductImage(id: Guid.NewGuid(), fileName: "file-2.png", originalFileName: "abc.png", url: "url/file-2.png", dateCreated: new DateTime(), productId: Guid.NewGuid());
        var newProductImage = ProductImageFactory.BuildExistingProductImage(id: Guid.NewGuid(), fileName: "file-3.png", originalFileName: "abc.png", url: "url/file-3.png", dateCreated: new DateTime(), productId: Guid.NewGuid());

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
            id: newMockProduct.Id.Value,
            name: newMockProduct.Name,
            price: newMockProduct.Price,
            description: newMockProduct.Description,
            images: newMockProduct.Images.Select(image => image.FileName).ToList()
        );

        var oldMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(oldMockProduct);
        var newMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(newMockProduct);

        _mockProductExistsValidator
            .Setup(validator => validator.Validate(It.Is<ProductId>(id => id == oldMockProduct.Id)))
            .ReturnsAsync(OneOf<Product, List<ApplicationError>>.FromT0(oldMockProduct));

        _latestProductHistoryExistsByIdValidator
            .Setup(validator => validator.Validate(It.Is<ProductId>(id => id == oldMockProduct.Id)))
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