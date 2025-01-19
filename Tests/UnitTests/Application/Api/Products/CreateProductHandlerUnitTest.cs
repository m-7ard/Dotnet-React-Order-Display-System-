using Application.Handlers.Products.Create;
using Application.Interfaces.Persistence;
using Application.Validators.DraftImageExistsValidator;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Shared;
using Moq;
using Tests.UnitTests.Utils;

namespace Tests.UnitTests.Application.Api.Products;

public class CreateProductHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IDraftImageRepository> _mockDraftImageRepository;
    private readonly Mock<IProductHistoryRepository> _mockProductHistoryRepository;
    private readonly Mock<IDraftImageExistsValidator<FileName>> _mockDraftImageExistsValidator;
    private readonly CreateProductHandler _handler;

    public CreateProductHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockDraftImageRepository = new Mock<IDraftImageRepository>();
        _mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        _mockDraftImageExistsValidator = new Mock<IDraftImageExistsValidator<FileName>>();

        _handler = new CreateProductHandler(
            productRepository: _mockProductRepository.Object,
            draftImageRepository: _mockDraftImageRepository.Object,
            productHistoryRepository: _mockProductHistoryRepository.Object,
            draftImageExistsValidator: _mockDraftImageExistsValidator.Object
        );
    }

    [Fact]
    public async Task CreateProduct_WitbhoutImages_Success()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: []
        );

        var command = new CreateProductCommand(
            name: mockProduct.Name,
            price: mockProduct.Price,
            description: mockProduct.Description,
            images: []
        );

        _mockProductRepository
            .Setup(repo => repo.CreateAsync(It.IsAny<Product>()))
            .ReturnsAsync(mockProduct);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
        _mockProductRepository.Verify(repo => repo.CreateAsync(It.IsAny<Product>()), Times.Once);
        _mockProductHistoryRepository.Verify(repo => repo.CreateAsync(It.IsAny<ProductHistory>()), Times.Once);
    }

    [Fact]
    public async Task CreateProduct_WithImages_Success()
    {
        // ARRANGE
        var productImage1 = Mixins.CreateProductImage(1);
        var productImage2 = Mixins.CreateProductImage(2);
        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: [productImage1, productImage2]
        );


        var command = new CreateProductCommand(
            name: mockProduct.Name,
            price: mockProduct.Price,
            description: mockProduct.Description,
            images: mockProduct.Images.Select(image => image.FileName.Value).ToList()
        );

        SetupMockServices.SetupDraftImageExistsValidatorSuccess(_mockDraftImageExistsValidator, productImage1.FileName, DraftImageFactory.BuildNewDraftImage(
            fileName: FileName.ExecuteCreate(productImage1.FileName.Value), 
            originalFileName: FileName.ExecuteCreate($"original-{productImage1.FileName.Value}"), 
            url: $"url/{productImage1.FileName.Value}"
        ));
        SetupMockServices.SetupDraftImageExistsValidatorSuccess(_mockDraftImageExistsValidator, productImage2.FileName, DraftImageFactory.BuildNewDraftImage(
            fileName: FileName.ExecuteCreate(productImage2.FileName.Value), 
            originalFileName: FileName.ExecuteCreate($"original-{productImage2.FileName.Value}"), 
            url: $"url/{productImage2.FileName.Value}"
        ));
        _mockProductRepository.Setup(repo => repo.CreateAsync(It.Is<Product>(product => product.Images.Count == 2))).ReturnsAsync(mockProduct);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
        //** Check and delete draft images
        _mockDraftImageRepository.Verify(repo => repo.DeleteByFileNameAsync(It.IsAny<FileName>()), Times.Exactly(2));
        //** Create product and product history
        _mockProductRepository.Verify(repo => repo.CreateAsync(It.IsAny<Product>()), Times.Once);
        _mockProductHistoryRepository.Verify(repo => repo.CreateAsync(It.IsAny<ProductHistory>()), Times.Once);
    }

    [Fact]
    public async Task CreateProduct_WithImagesAndInvalidFileExtension_Success()
    {
        // ARRANGE
        var productImage1 = Mixins.CreateProductImage(1);

        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: []
        );

        var command = new CreateProductCommand(
            name: mockProduct.Name,
            price: mockProduct.Price,
            description: mockProduct.Description,
            images: ["invalid-file-extension.txt"]
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        _mockDraftImageExistsValidator.Verify(validator => validator.Validate(It.IsAny<FileName>()), Times.Never);
    }
}