namespace Application.Api.Products.UploadImages.DTOs;

public class UploadProductImagesResponseDTO
{
    public UploadProductImagesResponseDTO(List<string> images)
    {
        Images = images;
    }

    public List<string> Images { get; set; }
}