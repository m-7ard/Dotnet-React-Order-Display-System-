using Domain.Models;
using Domain.ValueObjects.Shared;

namespace Application.Interfaces.Persistence;

public interface IDraftImageRepository
{
    Task<DraftImage> CreateAsync(DraftImage draftImage);
    Task<DraftImage?> GetByFileNameAsync(FileName fileName);
    Task DeleteByFileNameAsync(FileName fileName);
}