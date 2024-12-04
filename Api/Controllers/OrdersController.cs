using System.Net;
using Api.ApiModels;
using Api.DTOs.OrderItems.MarkFinished;
using Api.DTOs.Orders.Create;
using Api.DTOs.Orders.List;
using Api.DTOs.Orders.MarkFinished;
using Api.DTOs.Orders.Read;
using Api.Errors;
using Api.Interfaces;
using Application.Errors;
using Application.Handlers.OrderItems.MarkFinished;
using Application.Handlers.Orders.Create;
using Application.Handlers.Orders.List;
using Application.Handlers.Orders.MarkFinished;
using Application.Handlers.Orders.Read;
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
    private readonly IValidator<CreateOrderRequestDTO.OrderItem> _orderItemDataValidator;
    private readonly IApiModelService _apiModelService;

    public OrdersController(ISender mediator, IValidator<CreateOrderRequestDTO.OrderItem> createProductValidator, IApiModelService apiModelService)
    {
        _mediator = mediator;
        _orderItemDataValidator = createProductValidator;
        _apiModelService = apiModelService;
    }

    [HttpPost("create")]
    public async Task<ActionResult<CreateOrderResponseDTO>> Create(CreateOrderRequestDTO request)
    {
        if (request.OrderItemData.Count == 0)
        {
            return BadRequest(
                new List<ApiError>()
                {
                    ApiErrorFactory.CreateError(
                        path: ["orderItemData", "_"],
                        message: "Order Item Data cannot be empty.",
                        fieldName: "orderItemData"
                    )
                }
            );
        }

        var errors = new List<ApiError>();
        foreach (var (uid, orderItemData) in request.OrderItemData)
        {
            var validation = _orderItemDataValidator.Validate(orderItemData);
            if (!validation.IsValid)
            {
                errors.AddRange(ApiErrorFactory.FluentToApiErrors(
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
            orderItemData: request.OrderItemData.ToDictionary(
                kvp => kvp.Key,
                kvp => new CreateOrderCommand.OrderItem(
                    productId: kvp.Value.ProductId,
                    quantity: kvp.Value.Quantity
                )
            )
        );
        var result = await _mediator.Send(command);
        if (result.TryPickT1(out var handlerErrors, out var value))
        {
            return BadRequest(ApiErrorFactory.TranslateApplicationErrors(handlerErrors));
        }

        var respone = new CreateOrderResponseDTO(orderId: value.OrderId.ToString());
        return StatusCode(StatusCodes.Status201Created, respone);
    }

    [HttpGet("list")]
    public async Task<ActionResult<ListOrdersResponseDTO>> List(
        [FromQuery] string? id,
        [FromQuery] decimal? minTotal,
        [FromQuery] decimal? maxTotal,
        [FromQuery] string? status,
        [FromQuery] DateTime? createdBefore,
        [FromQuery] DateTime? createdAfter,
        [FromQuery] int? productId,
        [FromQuery] int? productHistoryId,
        [FromQuery] string? orderBy)
    {
        bool validId = Guid.TryParse(id, out var parsedId);

        var parameters = new ListOrdersRequestDTO(
            id: validId ? parsedId : null,
            minTotal: minTotal,
            maxTotal: maxTotal,
            status: status,
            createdBefore: createdBefore,
            createdAfter: createdAfter,
            productId: productId,
            productHistoryId: productHistoryId,
            orderBy: orderBy
        );

        if (parameters.ProductId is not null && parameters.ProductId <= 0)
        {
            parameters.ProductId = null;
        }

        if (parameters.ProductHistoryId is not null && parameters.ProductHistoryId <= 0)
        {
            parameters.ProductHistoryId = null;
        }

        if (parameters.MinTotal is not null && parameters.MinTotal < 0)
        {
            parameters.MinTotal = null;
        }

        if (parameters.MaxTotal is not null && parameters.MinTotal is not null && parameters.MinTotal > parameters.MaxTotal)
        {
            parameters.MinTotal = null;
            parameters.MaxTotal = null;
        }

        if (parameters.CreatedBefore is not null && parameters.CreatedAfter is not null && parameters.CreatedBefore > parameters.CreatedAfter)
        {
            parameters.CreatedBefore = null;
            parameters.CreatedAfter = null;
        }

        var query = new ListOrdersQuery(
            minTotal: parameters.MinTotal,
            maxTotal: parameters.MaxTotal,
            status: parameters.Status,
            createdBefore: parameters.CreatedBefore,
            createdAfter: parameters.CreatedAfter,
            id: parameters.Id,
            productId: parameters.ProductId,
            productHistoryId: parameters.ProductHistoryId,
            orderBy: parameters.OrderBy
        );

        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(ApiErrorFactory.TranslateApplicationErrors(errors));
        }

        var orders = new List<OrderApiModel>();
        foreach (var order in value.Orders)
        {
            var apiModelResult = await _apiModelService.TryCreateOrderApiModel(order);
            if (apiModelResult.TryPickT1(out var apiModelErrors, out var apiModelValue))
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ApiErrorFactory.TranslateApplicationErrors(apiModelErrors));
            }

            orders.Add(apiModelValue);
        }

        var response = new ListOrdersResponseDTO(orders: orders);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReadOrderResponseDTO>> Read(string id)
    {
        bool validId = Guid.TryParse(id, out var parsedId);
        if (!validId)
        {
            return NotFound();
        }

        var query = new ReadOrderQuery(id: parsedId);
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return errors.Any(err => err.Code is ApplicationErrorCodes.ModelDoesNotExist)
                ? NotFound(ApiErrorFactory.TranslateApplicationErrors(errors))
                : StatusCode((int)HttpStatusCode.InternalServerError, ApiErrorFactory.TranslateApplicationErrors(errors));
        };

        var apiModelResult = await _apiModelService.TryCreateOrderApiModel(value.Order);
        if (apiModelResult.TryPickT1(out var apiModelErrors, out var apiModelValue))
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ApiErrorFactory.TranslateApplicationErrors(apiModelErrors));
        }

        var response = new ReadOrderResponseDTO(order: apiModelValue);
        return Ok(response);
    }

    [HttpPut("{orderId}/item/{orderItemId}/mark_finished")]
    public async Task<ActionResult<MarkOrderItemFinishedResponseDTO>> MarkOrderItemFinished(string orderId, string orderItemId)
    {
        if (!Guid.TryParse(orderId, out var parsedOrderId))
        {
            return NotFound();
        }

        if (!Guid.TryParse(orderItemId, out var parsedOrderItemId))
        {
            return NotFound();
        }
        
        var query = new MarkOrderItemFinishedCommand(
            orderId: parsedOrderId,
            orderItemId: parsedOrderItemId
        );

        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return errors.Any(err => err.Code is ApplicationErrorCodes.ModelDoesNotExist)
                ? NotFound(ApiErrorFactory.TranslateApplicationErrors(errors))
                : BadRequest(ApiErrorFactory.TranslateApplicationErrors(errors));
        };

        var response = new MarkOrderItemFinishedResponseDTO(orderId: value.OrderId.ToString(), orderItemId: value.OrderItemId.ToString());
        return Ok(response);
    }

    [HttpPut("{orderId}/mark_finished")]
    public async Task<ActionResult<MarkOrderFinishedResponseDTO>> MarkFinished(string orderId)
    {
        if (!Guid.TryParse(orderId, out var parsedOrderId))
        {
            return NotFound();
        }

        var query = new MarkOrderFinishedCommand(
            orderId: parsedOrderId
        );

        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return errors.Any(err => err.Code is ApplicationErrorCodes.ModelDoesNotExist)
                ? NotFound(ApiErrorFactory.TranslateApplicationErrors(errors))
                : BadRequest(ApiErrorFactory.TranslateApplicationErrors(errors));
        };

        var response = new MarkOrderFinishedResponseDTO(orderId: value.OrderId.ToString());
        return Ok(response);
    }
}