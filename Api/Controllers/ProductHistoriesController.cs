using Api.DTOs.ProductHistories.List;
using Api.DTOs.Products.Create;
using Api.DTOs.Products.Update;
using Api.Interfaces;
using Api.Mappers;
using Application.Handlers.ProductHistories.List;
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

    public ProductHistoryController(ISender mediator, IPlainErrorHandlingService errorHandlingService, IValidator<CreateProductRequestDTO> createProductValidator, IValidator<UpdateProductRequestDTO> updateProductValidator)
    {
        _mediator = mediator;
        _errorHandlingService = errorHandlingService;
    }

    [HttpGet("list")]
    public async Task<ActionResult<ListProductHistoriesResponseDTO>> List(
        [FromQuery] string? name, 
        [FromQuery] decimal? minPrice, 
        [FromQuery] decimal? maxPrice, 
        [FromQuery] string? description, 
        [FromQuery] DateTime? validTo, 
        [FromQuery] DateTime? validFrom,
        [FromQuery] string? productId,
        [FromQuery] string? orderBy)
    {
        var parameters = new ListProductHistoriesRequestDTO(
            name: name,
            minPrice: minPrice,
            maxPrice: maxPrice,
            description: description,
            validTo: validTo,
            validFrom: validFrom,
            productId: Guid.TryParse(productId, out var parsedId) ? parsedId : null,
            orderBy: orderBy
        );
        if (parameters.Name is not null && parameters.Name.Length == 0)
        {
            parameters.Name = null;
        }

        if (parameters.MinPrice is not null && parameters.MinPrice < 0)
        {
            parameters.MinPrice = null;
        }

        if (parameters.MaxPrice is not null && parameters.MinPrice is not null && parameters.MinPrice > parameters.MaxPrice)
        {
            parameters.MinPrice = null;
            parameters.MaxPrice = null;
        }

        if (parameters.Description is not null && parameters.Description.Length == 0)
        {
            parameters.Description = null;
        }

        if (parameters.ValidTo is not null && parameters.ValidFrom is not null && parameters.ValidTo < parameters.ValidFrom)
        {
            parameters.ValidTo = null;
            parameters.ValidFrom = null;
        }

        var query = new ListProductHistoriesQuery(
            name: parameters.Name,
            minPrice: parameters.MinPrice,
            maxPrice: parameters.MaxPrice,
            description: parameters.Description,
            validTo: parameters.ValidTo,
            validFrom: parameters.ValidFrom,
            productId: parameters.ProductId,
            orderBy: parameters.OrderBy
        );
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        }

        var response = new ListProductHistoriesResponseDTO(productHistories: value.ProductHistories.Select(ApiModelMapper.ProductHistoryToApiModel).ToList());
        return Ok(response);
    }
}