using Domain.Models;
using Domain.ValueObjects.DraftImage;

namespace Application.Interfaces.Persistence;

public interface IDraftImageRepository
{
    Task<DraftImage> CreateAsync(DraftImage draftImage);
    Task<DraftImage?> GetByFileNameAsync(FileName fileName);
    Task DeleteByFileNameAsync(FileName fileName);
}