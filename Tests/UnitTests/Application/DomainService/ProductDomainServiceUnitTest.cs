using Application.Contracts.DomainService.ProductDomainService;
using Application.DomainService;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.DomainFactories;
using Moq;

namespace Tests.UnitTests.Application.DomainService;

public class ProductDomainServiceUnitTest
{
    private readonly ProductDomainService _productDomainService;
    private readonly Mock<IDraftImageDomainService> _mockDraftImageDomainService;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IProductHistoryDomainService> _productHistoryDomainService;

    public ProductDomainServiceUnitTest()
    {
        _mockDraftImageDomainService = new Mock<IDraftImageDomainService>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
    
        var mockProductRepository = new Mock<IProductRepository>();
        var mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        var mockDraftImageRepository = new Mock<IDraftImageRepository>();

        _mockUnitOfWork.Setup(uow => uow.ProductRepository).Returns(mockProductRepository.Object);
        _mockUnitOfWork.Setup(uow => uow.ProductHistoryRepository).Returns(mockProductHistoryRepository.Object);
        _mockUnitOfWork.Setup(uow => uow.DraftImageRepository).Returns(mockDraftImageRepository.Object);

        _productHistoryDomainService = new Mock<IProductHistoryDomainService>();

        _productDomainService = new ProductDomainService(
            draftImageDomainService: _mockDraftImageDomainService.Object,
            unitOfWork: _mockUnitOfWork.Object,
            productHistoryDomainService: _productHistoryDomainService.Object
        );
    }

    // -------------------------------
    // Create New Order

    [Fact]
    public async Task TryOrchestrateCreateProduct_ValidData_Success()
    {
        // ARRANGE


        // ACT
        var result = await _productDomainService.TryOrchestrateCreateProduct(new OrchestrateCreateNewProductContract(
            id: Guid.NewGuid(),
            name: "name",
            price: 100,
            description: "description",
            amount: 100
        ));
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    // -------------------------------
    // Add New Product Image

    [Fact]
    public async Task TryOrchestrateAddNewProductImage_ValidData_Success()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var mockDraftImage = Mixins.CreateDraftImage(seed: 1);

        _mockDraftImageDomainService
            .Setup(service => service.GetDraftImageByFileName(mockDraftImage.FileName.Value))
            .ReturnsAsync(() => mockDraftImage);

        // ACT
        var result = await _productDomainService.TryOrchestrateAddNewProductImage(product: mockProduct, fileName: mockDraftImage.FileName.Value);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task TryOrchestrateAddNewProductImage_DraftImageDoesNotExist_Failure()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var mockDraftImage = Mixins.CreateDraftImage(seed: 1);

        _mockDraftImageDomainService
            .Setup(service => service.GetDraftImageByFileName(mockDraftImage.FileName.Value))
            .ReturnsAsync(() => "");

        // ACT
        var result = await _productDomainService.TryOrchestrateAddNewProductImage(product: mockProduct, fileName: mockDraftImage.FileName.Value);
        
        // ASSERT
        Assert.True(result.IsT1);
    }

    // -------------------------------
    // Update Product Images

    [Fact]
    public async Task TryOrchestrateUpdateImages_ValidData_Success()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var mockDraftImage = Mixins.CreateDraftImage(seed: 1);

        _mockDraftImageDomainService
            .Setup(service => service.GetDraftImageByFileName(mockDraftImage.FileName.Value))
            .ReturnsAsync(() => mockDraftImage);
        
        // ACT
        var result = await _productDomainService.TryOrchestrateUpdateImages(product: mockProduct, fileNames: [mockDraftImage.FileName.Value]);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task TryOrchestrateUpdateImages_DraftImageDoesNotExist_Failure()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var mockDraftImage = Mixins.CreateDraftImage(seed: 1);

        _mockDraftImageDomainService
            .Setup(service => service.GetDraftImageByFileName(mockDraftImage.FileName.Value))
            .ReturnsAsync(() => "");
        
        // ACT
        var result = await _productDomainService.TryOrchestrateUpdateImages(product: mockProduct, fileNames: [mockDraftImage.FileName.Value]);
        
        // ASSERT
        Assert.True(result.IsT1);
    }

    // -------------------------------
    // Update Product

    [Fact]
    public async Task TryOrchestrateUpdateProduct_ValidData_Success()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var mockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(mockProduct);
        var contract = new OrchestrateUpdateProductContract(id: mockProduct.Id.Value, name: mockProduct.Name, price: mockProduct.Price.Value, description: mockProduct.Description);

        _productHistoryDomainService
            .Setup(service => service.GetLatestProductHistoryForProduct(mockProduct))
            .ReturnsAsync(() => mockProductHistory);
        
        // ACT
        var result = await _productDomainService.TryOrchestrateUpdateProduct(product: mockProduct, contract: contract);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task TryOrchestrateUpdateProduct_LatestProductHistoryDoesNotExist_Failure()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var contract = new OrchestrateUpdateProductContract(id: mockProduct.Id.Value, name: mockProduct.Name, price: mockProduct.Price.Value, description: mockProduct.Description);

        _productHistoryDomainService
            .Setup(service => service.GetLatestProductHistoryForProduct(mockProduct))
            .ReturnsAsync(() => "");
        
        // ACT
        var result = await _productDomainService.TryOrchestrateUpdateProduct(product: mockProduct, contract: contract);
        
        // ASSERT
        Assert.True(result.IsT1);
    }
}