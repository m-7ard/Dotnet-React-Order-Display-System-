using Application.Api.Products.Create.DTOs;
using Application.Api.Products.Create.Handlers;
using Application.Api.Products.List.DTOs;
using Application.Api.Products.List.Handlers;
using Application.Api.Products.Read.DTOs;
using Application.Api.Products.Read.Handlers;
using Application.Api.Products.UploadImages.DTOs;
using Application.Api.Products.UploadImages.Handlers;
using Application.ErrorHandling.Api;
using Application.ErrorHandling.Other;
using Application.Interfaces.Services;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/products/")]
public class ProductsController : ControllerBase
{
    private readonly ISender _mediator;
    private readonly IPlainErrorHandlingService _errorHandlingService;
    private readonly IValidator<CreateProductRequestDTO> _createProductValidator;
    private readonly List<string> _permittedExtensions = [".jpg", ".jpeg", ".png"];
    private readonly long _fileSizeLimit = 8 * 1024 * 1024; // 8 MB

    public ProductsController(ISender mediator, IPlainErrorHandlingService errorHandlingService, IValidator<CreateProductRequestDTO> createProductValidator)
    {
        _mediator = mediator;
        _errorHandlingService = errorHandlingService;
        _createProductValidator = createProductValidator;
    }

    [HttpPost("create")]
    public async Task<ActionResult<CreateProductResponseDTO>> Create(CreateProductRequestDTO request)
    {
        var validation = _createProductValidator.Validate(request);
        var validationErrors = new List<PlainApiError>();
        if (!validation.IsValid)
        {
            var fluentErrors = _errorHandlingService.FluentToApiErrors(
                validationFailures: validation.Errors,
                path: []
            );
            validationErrors.AddRange(fluentErrors);

        }

        if (request.Images.Count > 8) {
            validationErrors.Add(_errorHandlingService.CreateError(
                path: ["images", "_"],
                message: "Only up to 8 images are allowed.",
                fieldName: "images"
            ));
        }

        if (validationErrors.Count > 0) {
            return BadRequest(validationErrors);
        }

        var command = new CreateProductCommand
        (
            name: request.Name,
            price: request.Price,
            description: request.Description,
            images: request.Images
        );
        var result = await _mediator.Send(command);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        }
        
        var response = new CreateProductResponseDTO(product: value.Product);
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPost("upload_images")]
    public async Task<ActionResult<UploadProductImagesResponseDTO>> UploadImages(List<IFormFile> files)
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

        var command = new UploadProductImagesCommand(files: files);
        var result = await _mediator.Send(command);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        }

        var response = new UploadProductImagesResponseDTO(images: value.ProductImages.Select(file => file.FileName).ToList());
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpGet("list")]
    public async Task<ActionResult<ListProductsResponseDTO>> List(
        [FromQuery] string? name, 
        [FromQuery] float? minPrice, 
        [FromQuery] float? maxPrice, 
        [FromQuery] string? description, 
        [FromQuery] DateTime? createdBefore, 
        [FromQuery] DateTime? createdAfter)
    {
        var query = new ListProductsQuery(
            name: name,
            minPrice: minPrice,
            maxPrice: maxPrice,
            description: description,
            createdBefore: createdBefore,
            createdAfter: createdAfter
        );
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        }

        var response = new ListProductsResponseDTO(products: value.Products);
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ListProductsResponseDTO>> Read(int id)
    {
        var query = new ReadProductQuery(
            id: id
        );
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return errors.Any(err => err.Code is ValidationErrorCodes.ModelDoesNotExist)
                ? NotFound(_errorHandlingService.TranslateServiceErrors(errors))
                : BadRequest(_errorHandlingService.TranslateServiceErrors(errors));        
        }

        var response = new ReadProductResponseDTO(product: value.Product);
        return Ok(response);
    }
}