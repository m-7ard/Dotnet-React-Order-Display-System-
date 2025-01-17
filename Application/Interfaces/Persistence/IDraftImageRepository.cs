using Domain.Models;
using Domain.ValueObjects.DraftImage;

namespace Application.Interfaces.Persistence;

public interface IDraftImageRepository
{
    Task<DraftImage> CreateAsync(DraftImage draftImage);
    Task<DraftImage?> GetByFileNameAsync(DraftImageFileName fileName);
    Task DeleteByFileNameAsync(DraftImageFileName fileName);
}