using Domain.Models;

namespace Application.Api.Products.UploadImages.Handlers;

public class UploadProductImagesResult
{
    public UploadProductImagesResult(List<ProductImage> productImages)
    {
        ProductImages = productImages;
    }

    public List<ProductImage> ProductImages { get; set; }
}