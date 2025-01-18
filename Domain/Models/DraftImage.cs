using Domain.ValueObjects.DraftImage;

namespace Domain.Models;

public class DraftImage
{
    public DraftImage(int id, FileName fileName, FileName originalFileName, string url, DateTime dateCreated)
    {
        Id = id;
        FileName = fileName;
        OriginalFileName = originalFileName;
        Url = url;
        DateCreated = dateCreated;
    }

    public int Id { get; private set; }
    public FileName FileName { get; private set; }
    public FileName OriginalFileName { get; private set; }
    public string Url { get; private set; }
    public DateTime DateCreated { get; private set; }
}