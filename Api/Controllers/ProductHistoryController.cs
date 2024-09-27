using Application.Api.ProductHistories.List.DTOs;
using Application.Api.ProductHistories.List.Handlers;
using Application.Api.Products.Create.DTOs;
using Application.Api.Products.List.DTOs;
using Application.Api.Products.Update.DTOs;
using Application.Interfaces.Services;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/product_histories/")]
public class ProductHistoryController : ControllerBase
{
    private readonly ISender _mediator;
    private readonly IPlainErrorHandlingService _errorHandlingService;
    private readonly IApiModelService _apiModelService;

    public ProductHistoryController(ISender mediator, IPlainErrorHandlingService errorHandlingService, IValidator<CreateProductRequestDTO> createProductValidator, IValidator<UpdateProductRequestDTO> updateProductValidator, IApiModelService apiModelService)
    {
        _mediator = mediator;
        _errorHandlingService = errorHandlingService;
        _apiModelService = apiModelService;
    }

    [HttpGet("list")]
    public async Task<ActionResult<ListProductsResponseDTO>> List(
        [FromQuery] string? name, 
        [FromQuery] decimal? minPrice, 
        [FromQuery] decimal? maxPrice, 
        [FromQuery] string? description, 
        [FromQuery] DateTime? validTo, 
        [FromQuery] DateTime? validFrom,
        [FromQuery] int? productId)
    {
    
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

        if (validTo is not null && validFrom is not null && validTo < validFrom)
        {
            validTo = null;
            validFrom = null;
        }

        var query = new ListProductHistoriesQuery(
            name: name,
            minPrice: minPrice,
            maxPrice: maxPrice,
            description: description,
            validTo: validTo,
            validFrom: validFrom,
            productId: productId
        );
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        }

        var response = new ListProductHistoriesResponseDTO(productHistories: value.ProductHistories.Select(_apiModelService.CreateProductHistoryApiModel).ToList());
        return Ok(response);
    }
}