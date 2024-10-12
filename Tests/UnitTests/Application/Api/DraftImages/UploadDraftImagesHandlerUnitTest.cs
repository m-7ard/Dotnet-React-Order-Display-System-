using Application.Api.DraftImages.UploadImages.Handlers;
using Application.Common;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Tests.UnitTests.Application.Api.DraftImages;

public class UploadDraftImagesHandlerUnitTest
{
    private readonly Mock<IDraftImageRepository> _mockDraftImageRepository;
    private readonly Mock<IFileStorage> _mockFileStorage;
    private readonly UploadDraftImagesHandler _handler;

    public UploadDraftImagesHandlerUnitTest()
    {
        _mockDraftImageRepository = new Mock<IDraftImageRepository>();
        _mockFileStorage = new Mock<IFileStorage>();
        _handler = new UploadDraftImagesHandler(
            draftImageRepository: _mockDraftImageRepository.Object,
            fileStorage: _mockFileStorage.Object
        );
    }

    [Fact]
    public async Task UploadDraftImages_ValidData_Success()
    {
        // ARRANGE
        var mockFile = new Mock<IFormFile>();
        mockFile.Setup(d => d.FileName).Returns("filename.png");

        var command = new UploadDraftImagesCommand(
            files: [mockFile.Object]
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
        _mockFileStorage.Verify(storage => storage.SaveFile(
            mockFile.Object, 
            It.Is<string>(d => d.StartsWith(DirectoryService.GetMediaDirectory())),
            CancellationToken.None
        ), Times.Once);
    }
}