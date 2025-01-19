using Domain.Models;
using Domain.ValueObjects.Shared;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class DraftImageMapper
{
    public static DraftImage ToDomain(DraftImageDbEntity source)
    {
        return new DraftImage(
            id: source.Id,
            fileName: FileName.ExecuteCreate(source.FileName),
            originalFileName: FileName.ExecuteCreate(source.OriginalFileName),
            dateCreated: source.DateCreated,
            url: source.Url
        );
    }

    public static DraftImageDbEntity ToDbModel(DraftImage source)
    {
        return new DraftImageDbEntity(
            id: source.Id,
            fileName: source.FileName.Value,
            originalFileName: source.OriginalFileName.Value,
            dateCreated: source.DateCreated,
            url: source.Url
        );
    }
}