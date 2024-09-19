using Domain.Models;

namespace Application.Api.DraftImages.UploadImages.Handlers;

public class UploadDraftImagesResult
{
    public UploadDraftImagesResult(List<DraftImage> draftImages)
    {
        DraftImage = draftImages;
    }

    public List<DraftImage> DraftImage { get; set; }
}