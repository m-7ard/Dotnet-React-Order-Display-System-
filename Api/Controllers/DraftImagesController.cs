using Api.ApiModels;
using Api.DTOs.DraftImages.UploadImages;
using Api.Errors;
using Api.Interfaces;
using Application.Handlers.DraftImages.UploadImages;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/draft_images/")]
public class DraftImagesController : ControllerBase
{
    private readonly ISender _mediator;
    private readonly IPlainErrorHandlingService _errorHandlingService;
    private readonly List<string> _permittedExtensions = [".jpg", ".jpeg", ".png"];
    private readonly long _fileSizeLimit = 8 * 1024 * 1024; // 8 MB

    public DraftImagesController(ISender mediator, IPlainErrorHandlingService errorHandlingService, IApiModelService apiModelService)
    {
        _mediator = mediator;
        _errorHandlingService = errorHandlingService;
    }

    [HttpPost("upload_images")]
    public async Task<ActionResult<UploadDraftImagesRequestDTO>> UploadImages(List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
        {
            return BadRequest(new List<PlainApiError>() {
                _errorHandlingService.CreateError(
                    path: ["_"],
                    message: "Must upload at least 1 file.",
                    fieldName: "_"
                )
            });
        }

        if (files.Count > 8)
        {
            return BadRequest(new List<PlainApiError>() {
                _errorHandlingService.CreateError(
                    path: ["_"],
                    message: "Cannot upload more than 8 files.",
                    fieldName: "_"
                )
            });
        }

        var contentTooLargeErrors = new List<PlainApiError>();

        foreach (var file in files)
        {
            if (file.Length > _fileSizeLimit)
            {
                contentTooLargeErrors.Add(
                    _errorHandlingService.CreateError(
                        path: [file.FileName],
                        message: $"File \"{file.FileName}\" exceeds the 8 MB size limit.",
                        fieldName: file.FileName
                    )
                );
            }
        }

        if (contentTooLargeErrors.Count > 0)
        {
            return StatusCode(StatusCodes.Status413PayloadTooLarge, contentTooLargeErrors);
        }

        var invalidFileFormatErrors = new List<PlainApiError>();

        foreach (var file in files)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !_permittedExtensions.Contains(extension))
            {
                invalidFileFormatErrors.Add(
                    _errorHandlingService.CreateError(
                        path: [file.FileName],
                        message: $"File \"{file.FileName}\" has an invalid file extension.",
                        fieldName: file.FileName
                    )
                );
            }

            if (invalidFileFormatErrors.Count > 0)
            {
                return StatusCode(StatusCodes.Status415UnsupportedMediaType, invalidFileFormatErrors);
            }
        }

        var command = new UploadDraftImagesCommand(files: files);
        var result = await _mediator.Send(command);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        }

        var response = new UploadDraftImagesResponseDTO(images: value.DraftImage.Select(d => new ImageApiModel(
            fileName: d.FileName,
            originalFileName: d.OriginalFileName,
            url: d.Url
        )).ToList());
        return StatusCode(StatusCodes.Status201Created, response);
    }
}