using Application.ApiModels;

namespace Application.Api.DraftImages.UploadImages.DTOs;

public class UploadDraftImagesResponseDTO
{
    public UploadDraftImagesResponseDTO(List<ImageApiModel> images)
    {
        Images = images;
    }

    public List<ImageApiModel> Images { get; set; }
}