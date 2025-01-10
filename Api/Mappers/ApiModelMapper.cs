using Api.ApiModels;
using Api.Services;
using Domain.Models;

namespace Api.Mappers;

public class ApiModelMapper
{
    public static ImageApiModel ProductImageToImageData(ProductImage source)
    {
        return new ImageApiModel(
            fileName: source.FileName,
            originalFileName: source.OriginalFileName,
            url: source.Url
        );
    }

    public static ImageApiModel DraftImageToImageData(DraftImage source)
    {
        return new ImageApiModel(
            fileName: source.FileName,
            originalFileName: source.OriginalFileName,
            url: source.Url
        );
    }    

    public static ProductApiModel ProductToApiModel(Product product)
    {
        return new ProductApiModel(
            id: product.Id.ToString(),
            name: product.Name,
            price: product.Price,
            description: product.Description,
            dateCreated: TimeZoneService.ConvertUtcToLocalTime(product.DateCreated),
            images: product.Images.Select(ProductImageToImageData).ToList()
        );
    }

    public static ProductHistoryApiModel ProductHistoryToApiModel(ProductHistory productHistory)
    {
        return new ProductHistoryApiModel(
            id: productHistory.Id.ToString(),
            name: productHistory.Name,
            images: productHistory.Images,
            description: productHistory.Description,
            price: productHistory.Price,
            productId: productHistory.ProductId.ToString(),
            validFrom: TimeZoneService.ConvertUtcToLocalTime(productHistory.ValidFrom),
            validTo: productHistory.ValidTo is null ? null : TimeZoneService.ConvertUtcToLocalTime(productHistory.ValidTo.Value)
        );
    }

    public static OrderItemApiModel OrderItemToApiModel(OrderItem orderItem, ProductHistory productHistory)
    {
        return new OrderItemApiModel(
            id: orderItem.Id.ToString(),
            quantity: orderItem.Quantity,
            status: orderItem.Status.Name,
            dateCreated: TimeZoneService.ConvertUtcToLocalTime(orderItem.OrderItemDates.DateCreated),
            dateFinished: orderItem.OrderItemDates.DateFinished is null ? null : TimeZoneService.ConvertUtcToLocalTime(orderItem.OrderItemDates.DateFinished.Value),
            orderId: orderItem.OrderId.ToString(),
            productHistory: ProductHistoryToApiModel(productHistory),
            serialNumber: orderItem.SerialNumber
        );
    }

    public static OrderApiModel OrderToApiModel(Order order, List<OrderItemApiModel> orderItems)
    {
        return new OrderApiModel(
            id: order.Id.ToString(),
            total: order.Total,
            dateCreated: order.OrderDates.DateCreated,
            dateFinished: order.OrderDates.DateFinished,
            orderItems: orderItems,
            status: order.Status.Name,
            serialNumber: order.SerialNumber
        );
    }
}