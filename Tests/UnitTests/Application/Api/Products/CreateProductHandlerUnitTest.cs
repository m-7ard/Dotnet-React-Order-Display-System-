using Application.Handlers.Products.Create;
using Application.Interfaces.Persistence;
using Application.Validators;
using Domain.DomainFactories;
using Domain.Models;
using Moq;

namespace Tests.UnitTests.Application.Api.Products;

public class CreateProductHandlerUnitTest
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IDraftImageRepository> _mockDraftImageRepository;
    private readonly Mock<IProductHistoryRepository> _mockProductHistoryRepository;
    private readonly CreateProductHandler _handler;

    public CreateProductHandlerUnitTest()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockDraftImageRepository = new Mock<IDraftImageRepository>();
        _mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        _handler = new CreateProductHandler(
            productRepository: _mockProductRepository.Object,
            draftImageRepository: _mockDraftImageRepository.Object,
            productHistoryRepository: _mockProductHistoryRepository.Object,
            draftImageExistsValidator: new DraftImageExistsValidatorAsync(_mockDraftImageRepository.Object)
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
        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: [
                Mixins.CreateProductImage(1),
                Mixins.CreateProductImage(2)
            ]
        );

        var command = new CreateProductCommand(
            name: mockProduct.Name,
            price: mockProduct.Price,
            description: mockProduct.Description,
            images: mockProduct.Images.Select(image => image.FileName).ToList()
        );

        _mockDraftImageRepository.Setup(repo => repo.GetByFileNameAsync(It.IsAny<string>())).ReturnsAsync(DraftImageFactory.BuildNewDraftImage(
            fileName: "fileName.png", 
            originalFileName: "originalFileName.png", 
            url: "url/fileName.png"
        ));
        _mockProductRepository.Setup(repo => repo.CreateAsync(It.Is<Product>(product => product.Images.Count == 2))).ReturnsAsync(mockProduct);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
        //** Check and delete draft images
        _mockDraftImageRepository.Verify(repo => repo.GetByFileNameAsync(It.IsAny<string>()), Times.Exactly(2));
        _mockDraftImageRepository.Verify(repo => repo.DeleteByFileNameAsync(It.IsAny<string>()), Times.Exactly(2));
        //** Create product and product history
        _mockProductRepository.Verify(repo => repo.CreateAsync(It.IsAny<Product>()), Times.Once);
        _mockProductHistoryRepository.Verify(repo => repo.CreateAsync(It.IsAny<ProductHistory>()), Times.Once);
    }

    [Fact]
    public async Task CreateProduct_WithImagesAndInvalidFileExtension_Success()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: [
                Mixins.CreateProductImage(1)
            ]
        );

        var command = new CreateProductCommand(
            name: mockProduct.Name,
            price: mockProduct.Price,
            description: mockProduct.Description,
            images: mockProduct.Images.Select(image => image.FileName).ToList()
        );

        _mockDraftImageRepository.Setup(repo => repo.GetByFileNameAsync(It.IsAny<string>())).ReturnsAsync(DraftImageFactory.BuildNewDraftImage(
            fileName: "fileName.txt", 
            originalFileName: "originalFileName.txt", 
            url: "url/fileName.txt"
        ));
        _mockProductRepository.Setup(repo => repo.CreateAsync(It.Is<Product>(product => product.Images.Count == 1))).ReturnsAsync(mockProduct);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
    }
}