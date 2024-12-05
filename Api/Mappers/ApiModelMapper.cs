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

    
}