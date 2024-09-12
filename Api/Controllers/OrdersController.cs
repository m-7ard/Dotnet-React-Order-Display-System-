using Application.Api.Orders.Create.DTOs;
using Application.Api.Orders.Create.Handlers;
using Application.Api.Orders.Create.Other;
using Application.Api.Orders.List.DTOs;
using Application.Api.Orders.List.Handlers;
using Application.Api.Orders.Read.DTOs;
using Application.Api.Orders.Read.Handlers;
using Application.Api.Products.Create.DTOs;
using Application.Api.Products.Create.Handlers;
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
[Route("api/orders/")]
public class OrdersController : ControllerBase
{
    private readonly ISender _mediator;
    private readonly IPlainErrorHandlingService _errorHandlingService;
    private readonly IValidator<OrderItemData> _orderItemDataValidator;

    public OrdersController(ISender mediator, IPlainErrorHandlingService errorHandlingService, IValidator<OrderItemData> createProductValidator)
    {
        _mediator = mediator;
        _errorHandlingService = errorHandlingService;
        _orderItemDataValidator = createProductValidator;
    }

    [HttpPost("create")]
    public async Task<ActionResult<CreateOrderRequestDTO>> Create(CreateOrderRequestDTO request)
    {
        var errors = new List<PlainApiError>();
        if (request.OrderItemData.Count == 0)
        {
            errors.Add(_errorHandlingService.CreateError(
                path: ["orderItemData", "_"],
                message: "Order Item Data cannot be empty.",
                fieldName: "orderItemData"
            ));
            return BadRequest(errors);
        }

        foreach (var (uid, orderItemData) in request.OrderItemData)
        {
            var validation = _orderItemDataValidator.Validate(orderItemData);
            if (!validation.IsValid)
            {
                errors.AddRange(_errorHandlingService.FluentToApiErrors(
                    validationFailures: validation.Errors,
                    path: ["orderItemData", uid]
                ));
            }
        }

        if (errors.Count > 0)
        {
            return BadRequest(errors);
        }

        var command = new CreateOrderCommand
        (
            orderItemData: request.OrderItemData
        );
        var result = await _mediator.Send(command);

        if (result.TryPickT1(out var handlerErrors, out var value))
        {
            return BadRequest(_errorHandlingService.TranslateServiceErrors(handlerErrors));
        }

        var response = new CreateOrderResponseDTO(order: value.Order);
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpGet("list")]
    public async Task<ActionResult<CreateOrderRequestDTO>> List(
        [FromQuery] float? minTotal,
        [FromQuery] float? maxTotal,
        [FromQuery] string? status,
        [FromQuery] DateTime? createdBefore,
        [FromQuery] DateTime? createdAfter)
    {
        var query = new ListOrdersQuery(
            minTotal: minTotal,
            maxTotal: maxTotal,
            status: status,
            createdBefore: createdBefore,
            createdAfter: createdAfter
        );

        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        }

        var response = new ListOrdersResponseDTO(orders: value.Orders);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CreateOrderRequestDTO>> Read(int id)
    {
        var query = new ReadOrderQuery(
            id: id
        );

        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return errors.Any(err => err.Code is ValidationErrorCodes.ModelDoesNotExist)
                ? NotFound(_errorHandlingService.TranslateServiceErrors(errors))
                : BadRequest(_errorHandlingService.TranslateServiceErrors(errors));
        };

        var response = new ReadOrderResponseDTO(order: value.Order);
        return Ok(response);
    }
}