using Application.Errors;
using Application.Handlers.Products.Update;
using Application.Interfaces.Persistence;
using Application.Validators;
using Application.Validators.DraftImageExistsValidator;
using Application.Validators.LatestProductHistoryExistsValidator;
using Application.Validators.ProductExistsValidator;
using Domain.Contracts.Products;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductImage;
using Domain.ValueObjects.Shared;
using Moq;
using OneOf;
using Tests.UnitTests.Utils;

namespace Tests.UnitTests.Application.Api.Products;

public class UpdateProductHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IDraftImageRepository> _mockDraftImageRepository;
    private readonly Mock<IProductHistoryRepository> _mockProductHistoryRepository;
    private readonly Mock<ILatestProductHistoryExistsValidator<ProductId>> _latestProductHistoryExistsByIdValidator;
    private readonly UpdateProductHandler _handler;
    private readonly Mock<IProductExistsValidator<ProductId>> _mockProductExistsValidator;
    private readonly Mock<IDraftImageExistsValidator<FileName>> _draftImageExistsValidator;

    public UpdateProductHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockDraftImageRepository = new Mock<IDraftImageRepository>();
        _mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        _mockProductExistsValidator = new Mock<IProductExistsValidator<ProductId>>(); 
        _latestProductHistoryExistsByIdValidator = new Mock<ILatestProductHistoryExistsValidator<ProductId>>();
        _draftImageExistsValidator = new Mock<IDraftImageExistsValidator<FileName>>();

        _handler = new UpdateProductHandler(
            productRepository: _mockProductRepository.Object,
            draftImageRepository: _mockDraftImageRepository.Object,
            productHistoryRepository: _mockProductHistoryRepository.Object,
            productExistsValidator: _mockProductExistsValidator.Object,
            latestProductHistoryExistsValidator: _latestProductHistoryExistsByIdValidator.Object,
            draftImageExistsValidator: _draftImageExistsValidator.Object
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

        var newMockProduct = Product.ExecuteCreate(
            new CreateProductContract(
                id: oldMockProduct.Id.Value,
                name: "Product 1 Updated",
                price: 100,
                description: "description updated",
                dateCreated: oldMockProduct.DateCreated,
                amount: 1,
                images: oldMockProduct.Images
            )
        );

        var query = new UpdateProductCommand(
            id: newMockProduct.Id.Value,
            name: newMockProduct.Name,
            price: newMockProduct.Price.Value,
            description: newMockProduct.Description,
            images: []
        );

        var oldMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(oldMockProduct);
        var newMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(newMockProduct);

        SetupMockServices.SetupProductExistsValidatorSuccess(_mockProductExistsValidator, oldMockProduct.Id, oldMockProduct);
        SetupMockServices.SetupLatestProductHistoryExistsValidatorSuccess(_latestProductHistoryExistsByIdValidator, oldMockProduct.Id, oldMockProductHistory);

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
        _mockProductRepository.Verify(repo => repo.UpdateAsync(It.Is<Product>(d => d.Name == newMockProduct.Name)), Times.Once);
        _mockProductHistoryRepository.Verify(repo => repo.CreateAsync(It.Is<ProductHistory>(d => d.Name == newMockProductHistory.Name)), Times.Once);
    }

    [Fact]
    public async Task UpdateProduct_WithImages_Success()
    {
        // ARRANGE
        var deleteProductImage = ProductImageFactory.BuildExistingProductImage(
            id: ProductImageId.ExecuteCreate(Guid.NewGuid()), 
            fileName: FileName.ExecuteCreate("delete-file.png"), 
            originalFileName: FileName.ExecuteCreate("abc.png"), 
            url: "url/delete-file.png", 
            dateCreated: new DateTime(), 
            productId: ProductId.ExecuteCreate(Guid.NewGuid()));
        
        var keepProductImage = ProductImageFactory.BuildExistingProductImage(
            id: ProductImageId.ExecuteCreate(Guid.NewGuid()), 
            fileName: FileName.ExecuteCreate("keep-file.png"), 
            originalFileName: FileName.ExecuteCreate("abc.png"), 
            url: "url/keep-file.png", 
            dateCreated: new DateTime(), 
            productId: ProductId.ExecuteCreate(Guid.NewGuid()));
        
        var newProductImage = ProductImageFactory.BuildExistingProductImage(
            id: ProductImageId.ExecuteCreate(Guid.NewGuid()), 
            fileName: FileName.ExecuteCreate("add-image.png"), 
            originalFileName: FileName.ExecuteCreate("abc.png"), 
            url: "url/add-image.png", 
            dateCreated: new DateTime(), 
            productId: ProductId.ExecuteCreate(Guid.NewGuid()));
        

        var oldMockProduct = Mixins.CreateProduct(
            seed: 1,
            images: [deleteProductImage, keepProductImage]
        );

        var newMockProduct = Product.ExecuteCreate(
            new CreateProductContract(
                id: oldMockProduct.Id.Value,
                name: "Product 1 Updated",
                price: 100,
                description: "description updated",
                dateCreated: oldMockProduct.DateCreated,
                amount: 1,
                images: [keepProductImage, newProductImage]
            )
        );

        var query = new UpdateProductCommand(
            id: newMockProduct.Id.Value,
            name: newMockProduct.Name,
            price: newMockProduct.Price.Value,
            description: newMockProduct.Description,
            images: newMockProduct.Images.Select(image => image.FileName.Value).ToList()
        );

        var oldMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(oldMockProduct);
        var newMockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(newMockProduct);

        SetupMockServices.SetupProductExistsValidatorSuccess(_mockProductExistsValidator, oldMockProduct.Id, oldMockProduct);
        SetupMockServices.SetupLatestProductHistoryExistsValidatorSuccess(_latestProductHistoryExistsByIdValidator, oldMockProduct.Id, oldMockProductHistory);
        SetupMockServices.SetupDraftImageExistsValidatorSuccess(_draftImageExistsValidator, newProductImage.FileName, DraftImageFactory.BuildNewDraftImage(
            fileName: FileName.ExecuteCreate(newProductImage.FileName.Value), 
            originalFileName: FileName.ExecuteCreate($"original-{newProductImage.FileName.Value}"), 
            url: $"url/{newProductImage.FileName.Value}"
        ));

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);

        // new ProductImage should have draft deleted
        _mockDraftImageRepository.Verify(repo => repo.DeleteByFileNameAsync(FileName.ExecuteCreate(newProductImage.FileName.Value)), Times.Once);
        
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