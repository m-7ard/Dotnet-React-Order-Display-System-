using Application.Api.Products.Create.DTOs;
using Application.Api.Products.Create.Handlers;
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
        if (!validation.IsValid)
        {
            var fluentErrors = _errorHandlingService.FluentToApiErrors(
                validationFailures: validation.Errors,
                path: []
            );
            return BadRequest(fluentErrors);
        }

        var command = new CreateProductCommand(name: request.Name);
        var result = await _mediator.Send(command);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        }
        
        var response = new CreateProductResponseDTO(product: value.Product);
        return StatusCode(StatusCodes.Status201Created, response);
    }

    /*
    
        TODO: list, delete, read, update; list products inside.
    
    */
}