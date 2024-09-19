using Domain.Models;

namespace Domain.DomainFactories;

public class DraftImageFactory
{
    public static DraftImage BuildExistingDraftImage(int id, string fileName, string originalFileName, string url, DateTime dateCreated)
    {
        return new DraftImage(
            id: id,
            fileName: fileName,
            originalFileName: originalFileName,
            url: url,
            dateCreated: dateCreated
        );
    }

    public static DraftImage BuildNewDraftImage(string fileName,string originalFileName, string url)
    {
        return new DraftImage(
            id: 0,
            fileName: fileName,
            originalFileName: originalFileName,
            url: url,
            dateCreated: new DateTime()
        );
    }
}