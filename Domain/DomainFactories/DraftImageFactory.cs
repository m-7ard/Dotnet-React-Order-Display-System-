using Domain.Models;
using Domain.ValueObjects.DraftImage;

namespace Domain.DomainFactories;

public class DraftImageFactory
{
    public static DraftImage BuildExistingDraftImage(int id, DraftImageFileName fileName, DraftImageFileName originalFileName, string url, DateTime dateCreated)
    {
        return new DraftImage(
            id: id,
            fileName: fileName,
            originalFileName: originalFileName,
            url: url,
            dateCreated: dateCreated
        );
    }

    public static DraftImage BuildNewDraftImage(DraftImageFileName fileName, DraftImageFileName originalFileName, string url)
    {
        return new DraftImage(
            id: 0,
            fileName: fileName,
            originalFileName: originalFileName,
            url: url,
            dateCreated: DateTime.UtcNow
        );
    }
}