namespace Application.Api.Products.UploadImages.DTOs;

public class UploadProductImagesResponseDTO
{
    public UploadProductImagesResponseDTO(List<string> fileNames)
    {
        FileNames = fileNames;
    }

    public List<string> FileNames { get; set; }
}