using Api.DTOs.Products.Create;
using Api.DTOs.Products.Delete;
using Api.DTOs.Products.List;
using Api.DTOs.Products.Read;
using Api.DTOs.Products.Update;
using Api.Errors;
using Api.Interfaces;
using Application.Api.Products.Create.Handlers;
using Application.Api.Products.Delete.Handlers;
using Application.Api.Products.List.Handlers;
using Application.Api.Products.Read.Handlers;
using Application.Api.Products.Update.Handlers;
using Application.Errors;
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
    private readonly IValidator<UpdateProductRequestDTO> _updateProductValidator;
    private readonly IApiModelService _apiModelService;

    public ProductsController(ISender mediator, IPlainErrorHandlingService errorHandlingService, IValidator<CreateProductRequestDTO> createProductValidator, IValidator<UpdateProductRequestDTO> updateProductValidator, IApiModelService apiModelService)
    {
        _mediator = mediator;
        _errorHandlingService = errorHandlingService;
        _createProductValidator = createProductValidator;
        _updateProductValidator = updateProductValidator;
        _apiModelService = apiModelService;
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
        
        var response = new CreateProductResponseDTO(product: _apiModelService.CreateProductApiModel(value.Product));
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpGet("list")]
    public async Task<ActionResult<ListProductsResponseDTO>> List(
        [FromQuery] int? id, 
        [FromQuery] string? name, 
        [FromQuery] decimal? minPrice, 
        [FromQuery] decimal? maxPrice, 
        [FromQuery] string? description, 
        [FromQuery] DateTime? createdBefore, 
        [FromQuery] DateTime? createdAfter,
        [FromQuery] string? orderBy)
    {
        if (id is not null && id <= 0)
        {
            id = null;
        }

        if (name is not null && name.Length == 0)
        {
            name = null;
        }

        if (minPrice is not null && minPrice < 0)
        {
            minPrice = null;
        }

        if (maxPrice is not null && minPrice is not null && minPrice > maxPrice)
        {
            minPrice = null;
            maxPrice = null;
        }

        if (description is not null && description.Length == 0)
        {
            description = null;
        }

        if (createdBefore is not null && createdAfter is not null && createdBefore > createdAfter)
        {
            createdBefore = null;
            createdAfter = null;
        }

        var query = new ListProductsQuery(
            id: id,
            name: name,
            minPrice: minPrice,
            maxPrice: maxPrice,
            description: description,
            createdBefore: createdBefore,
            createdAfter: createdAfter,
            orderBy: orderBy
        );
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        }

        var response = new ListProductsResponseDTO(products: value.Products.Select(_apiModelService.CreateProductApiModel).ToList());
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ReadProductResponseDTO>> Read(int id)
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

        var response = new ReadProductResponseDTO(product: _apiModelService.CreateProductApiModel(value.Product));
        return Ok(response);
    }

    [HttpPut("{id}/update")]
    public async Task<ActionResult<UpdateProductResponseDTO>> Update(int id, UpdateProductRequestDTO request)
    {
        var validation = _updateProductValidator.Validate(request);
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

        var query = new UpdateProductCommand(
            id: id,
            name: request.Name,
            price: request.Price,
            description: request.Description,
            images: request.Images
        );
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            if (errors.Any(err => err.Code is ValidationErrorCodes.ModelDoesNotExist))
            {
                return NotFound(_errorHandlingService.TranslateServiceErrors(errors));
            }
            else if (errors.Any(err => err.Code is ValidationErrorCodes.IntegrityError))
            {
                return Conflict(_errorHandlingService.TranslateServiceErrors(errors));
            }

            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors)); 
        }

        var response = new UpdateProductResponseDTO(product: _apiModelService.CreateProductApiModel(value.Product));
        return Ok(response);
    }

    [HttpPost("{id}/delete")]
    public async Task<ActionResult<UpdateProductResponseDTO>> Delete(int id, UpdateProductRequestDTO request)
    {
        var query = new DeleteProductCommand(
            id: id
        );
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            if (errors.Any(err => err.Code is ValidationErrorCodes.ModelDoesNotExist))
            {
                return NotFound(_errorHandlingService.TranslateServiceErrors(errors));
            }
            else if (errors.Any(err => err.Code is ValidationErrorCodes.IntegrityError))
            {
                return Conflict(_errorHandlingService.TranslateServiceErrors(errors));
            }

            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        }

        var response = new DeleteProductResponseDTO();
        return Ok(response);
    }
}