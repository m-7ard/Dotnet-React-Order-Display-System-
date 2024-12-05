using Api.ApiModels;
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
            dateCreated: product.DateCreated,
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
            validFrom: productHistory.ValidFrom,
            validTo: productHistory.ValidTo
        );
    }
}