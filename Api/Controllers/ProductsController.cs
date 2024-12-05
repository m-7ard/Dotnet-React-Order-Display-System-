using Api.DTOs.Products.Create;
using Api.DTOs.Products.Delete;
using Api.DTOs.Products.List;
using Api.DTOs.Products.Read;
using Api.DTOs.Products.Update;
using Api.Errors;
using Api.Interfaces;
using Api.Mappers;
using Application.Errors;
using Application.Handlers.Products.Create;
using Application.Handlers.Products.Delete;
using Application.Handlers.Products.List;
using Application.Handlers.Products.Read;
using Application.Handlers.Products.Update;
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
    private readonly IValidator<CreateProductRequestDTO> _createProductValidator;
    private readonly IValidator<UpdateProductRequestDTO> _updateProductValidator;

    public ProductsController(ISender mediator, IValidator<CreateProductRequestDTO> createProductValidator, IValidator<UpdateProductRequestDTO> updateProductValidator)
    {
        _mediator = mediator;
        _createProductValidator = createProductValidator;
        _updateProductValidator = updateProductValidator;
    }

    [HttpPost("create")]
    public async Task<ActionResult<CreateProductResponseDTO>> Create(CreateProductRequestDTO request)
    {
        var validationErrors = new List<ApiError>();
        var validation = _createProductValidator.Validate(request);
        
        if (!validation.IsValid)
        {
            validationErrors.AddRange(
                ApiErrorFactory.FluentToApiErrors(
                    validationFailures: validation.Errors,
                    path: []
                )
            );
        }

        if (request.Images.Count > 8) {
            validationErrors.Add(ApiErrorFactory.CreateError(
                path: ["images", "_"],
                message: "Only up to 8 images are allowed.",
                fieldName: "images"
            ));
        }

        if (validationErrors.Count > 0) {
            return BadRequest(validationErrors);
        }

        var command = new CreateProductCommand(
            name: request.Name,
            price: request.Price,
            description: request.Description,
            images: request.Images
        );
        var result = await _mediator.Send(command);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(ApiErrorFactory.TranslateApplicationErrors(errors));
        }
        
        var response = new CreateProductResponseDTO(product: ApiModelMapper.ProductToApiModel(value.Product));
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpGet("list")]
    public async Task<ActionResult<ListProductsResponseDTO>> List(
        [FromQuery] string? id, 
        [FromQuery] string? name, 
        [FromQuery] decimal? minPrice, 
        [FromQuery] decimal? maxPrice, 
        [FromQuery] string? description, 
        [FromQuery] DateTime? createdBefore, 
        [FromQuery] DateTime? createdAfter,
        [FromQuery] string? orderBy)
    {
        bool validId = Guid.TryParse(id, out var parsedId);

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
            id: validId ? parsedId : null,
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
            return BadRequest(ApiErrorFactory.TranslateApplicationErrors(errors));
        }

        var response = new ListProductsResponseDTO(products: value.Products.Select(ApiModelMapper.ProductToApiModel).ToList());
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ReadProductResponseDTO>> Read(string id)
    {
        bool validId = Guid.TryParse(id, out var parsedId);
        if (!validId)
        {
            return NotFound();
        }

        var query = new ReadProductQuery(id: parsedId);
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return errors.Any(err => err.Code is ApplicationErrorCodes.ModelDoesNotExist)
                ? NotFound(ApiErrorFactory.TranslateApplicationErrors(errors))
                : BadRequest(ApiErrorFactory.TranslateApplicationErrors(errors));        
        }

        var response = new ReadProductResponseDTO(product: ApiModelMapper.ProductToApiModel(value.Product));
        return Ok(response);
    }

    [HttpPut("{id}/update")]
    public async Task<ActionResult<UpdateProductResponseDTO>> Update(string id, UpdateProductRequestDTO request)
    {
        bool validId = Guid.TryParse(id, out var parsedId);
        if (!validId)
        {
            return NotFound();
        }

        var validation = _updateProductValidator.Validate(request);
        var validationErrors = new List<ApiError>();
        if (!validation.IsValid)
        {
            validationErrors.AddRange(ApiErrorFactory.FluentToApiErrors(
                validationFailures: validation.Errors,
                path: []
            ));

        }

        if (request.Images.Count > 8) {
            validationErrors.Add(ApiErrorFactory.CreateError(
                path: ["images", "_"],
                message: "Only up to 8 images are allowed.",
                fieldName: "images"
            ));
        }

        if (validationErrors.Count > 0) {
            return BadRequest(validationErrors);
        }

        var query = new UpdateProductCommand(
            id: parsedId,
            name: request.Name,
            price: request.Price,
            description: request.Description,
            images: request.Images
        );
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            if (errors.Any(err => err.Code is ApplicationErrorCodes.ModelDoesNotExist))
            {
                return NotFound(ApiErrorFactory.TranslateApplicationErrors(errors));
            }
            else if (errors.Any(err => err.Code is ApplicationErrorCodes.IntegrityError))
            {
                return Conflict(ApiErrorFactory.TranslateApplicationErrors(errors));
            }

            return BadRequest(ApiErrorFactory.TranslateApplicationErrors(errors)); 
        }

        var response = new UpdateProductResponseDTO(product: ApiModelMapper.ProductToApiModel(value.Product));
        return Ok(response);
    }

    [HttpPost("{id}/delete")]
    public async Task<ActionResult<UpdateProductResponseDTO>> Delete(string id, UpdateProductRequestDTO request)
    {
        bool validId = Guid.TryParse(id, out var parsedId);
        if (!validId)
        {
            return NotFound();
        }

        var query = new DeleteProductCommand(id: parsedId);
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            if (errors.Any(err => err.Code is ApplicationErrorCodes.ModelDoesNotExist))
            {
                return NotFound(ApiErrorFactory.TranslateApplicationErrors(errors));
            }
            else if (errors.Any(err => err.Code is ApplicationErrorCodes.IntegrityError))
            {
                return Conflict(ApiErrorFactory.TranslateApplicationErrors(errors));
            }

            return BadRequest(ApiErrorFactory.TranslateApplicationErrors(errors));
        }

        var response = new DeleteProductResponseDTO();
        return Ok(response);
    }
}