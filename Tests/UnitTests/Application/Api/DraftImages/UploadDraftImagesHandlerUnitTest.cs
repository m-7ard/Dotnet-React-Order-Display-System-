using Application.Api.DraftImages.UploadImages.Handlers;
using Application.Interfaces.Services;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Infrastructure.Persistence;
using Moq;

namespace Tests.UnitTests.Application.Api.DraftImages;

public class UploadDraftImagesHandlerUnitTest
{
    private readonly Mock<DraftImageRepository> _mockDraftImageRepository;
    private readonly Mock<IFileStorage> _mockFileStorage;
    private readonly Order _mockOrder;
    private readonly UploadDraftImagesHandler _handler;

    public UploadDraftImagesHandlerUnitTest()
    {
        _mockDraftImageRepository = new Mock<DraftImageRepository>();
        _mockFileStorage = new Mock<IFileStorage>();
        _handler = new UploadDraftImagesHandler(
            draftImageRepository: _mockDraftImageRepository.Object,
            fileStorage: _mockFileStorage.Object
        );

        _mockOrder = OrderFactory.BuildExistingOrder(
            id: 1,
            total: 100,
            dateCreated: DateTime.Today,
            dateFinished: DateTime.MinValue,
            orderItems: [],
            status: OrderStatus.Pending
        );
    }

    [Fact]
    public async Task UploadDraftImages_ValidData_Success()
    {
        // ARRANGE
        var command = new UploadDraftImagesCommand(
            files: []
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
    }
}