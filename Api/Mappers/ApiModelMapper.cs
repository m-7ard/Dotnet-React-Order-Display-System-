using Api.ApiModels;
using Api.Services;
using Domain.Models;

namespace Api.Mappers;

public class ApiModelMapper
{
    public static ImageApiModel ProductImageToImageData(ProductImage source)
    {
        return new ImageApiModel(
            fileName: source.FileName.Value,
            originalFileName: source.OriginalFileName.Value,
            url: source.Url
        );
    }

    public static ImageApiModel DraftImageToImageData(DraftImage source)
    {
        return new ImageApiModel(
            fileName: source.FileName.Value,
            originalFileName: source.OriginalFileName.Value,
            url: source.Url
        );
    }    

    public static ProductApiModel ProductToApiModel(Product product)
    {
        return new ProductApiModel(
            id: product.Id.ToString(),
            name: product.Name,
            price: product.Price.Value,
            description: product.Description,
            dateCreated: TimeZoneService.ConvertUtcToLocalTime(product.DateCreated),
            images: product.Images.Select(ProductImageToImageData).ToList(),
            amount: product.Amount.Value
        );
    }

    public static ProductHistoryApiModel ProductHistoryToApiModel(ProductHistory productHistory)
    {
        return new ProductHistoryApiModel(
            id: productHistory.Id.ToString(),
            name: productHistory.Name,
            images: productHistory.Images,
            description: productHistory.Description,
            price: productHistory.Price.Value,
            productId: productHistory.ProductId.ToString(),
            validFrom: TimeZoneService.ConvertUtcToLocalTime(productHistory.ValidityRange.ValidFrom),
            validTo: productHistory.ValidityRange.ValidTo is null ? null : TimeZoneService.ConvertUtcToLocalTime(productHistory.ValidityRange.ValidTo.Value)
        );
    }

    public static OrderItemApiModel OrderItemToApiModel(Order order, OrderItem orderItem, ProductHistory productHistory)
    {
        return new OrderItemApiModel(
            id: orderItem.Id.ToString(),
            quantity: orderItem.Quantity.Value,
            status: orderItem.Status.Name,
            dateCreated: TimeZoneService.ConvertUtcToLocalTime(orderItem.OrderItemDates.DateCreated),
            dateFinished: orderItem.OrderItemDates.DateFinished is null ? null : TimeZoneService.ConvertUtcToLocalTime(orderItem.OrderItemDates.DateFinished.Value),
            orderId: order.Id.Value.ToString(),
            productHistory: ProductHistoryToApiModel(productHistory),
            serialNumber: orderItem.SerialNumber
        );
    }

    public static OrderApiModel OrderToApiModel(Order order, List<OrderItemApiModel> orderItems)
    {
        return new OrderApiModel(
            id: order.Id.Value.ToString(),
            total: order.Total.Value,
            dateCreated: TimeZoneService.ConvertUtcToLocalTime(order.OrderDates.DateCreated),
            dateFinished: order.OrderDates.DateFinished is null ? null : TimeZoneService.ConvertUtcToLocalTime(order.OrderDates.DateFinished.Value),
            orderItems: orderItems,
            status: order.Status.Name,
            serialNumber: order.SerialNumber
        );
    }
}