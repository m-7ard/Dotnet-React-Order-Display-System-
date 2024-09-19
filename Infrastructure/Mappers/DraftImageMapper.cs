using Domain.Models;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class DraftImageMapper
{
    public static DraftImage ToDomain(DraftImageDbEntity source)
    {
        return new DraftImage(
            id: source.Id,
            fileName: source.FileName,
            originalFileName: source.OriginalFileName,
            dateCreated: source.DateCreated,
            url: source.Url
        );
    }

    public static DraftImageDbEntity ToDbModel(DraftImage source)
    {
        return new DraftImageDbEntity(
            id: source.Id,
            fileName: source.FileName,
            originalFileName: source.OriginalFileName,
            dateCreated: source.DateCreated,
            url: source.Url
        );
    }
}