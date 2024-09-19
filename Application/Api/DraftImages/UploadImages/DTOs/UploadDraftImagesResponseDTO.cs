namespace Application.Api.DraftImages.UploadImages.DTOs;

public class UploadDraftImagesResponseDTO
{
    public UploadDraftImagesResponseDTO(List<string> images)
    {
        Images = images;
    }

    public List<string> Images { get; set; }
}