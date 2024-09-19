using Domain.Models;

namespace Application.Interfaces.Persistence;

public interface IDraftImageRepository
{
    Task<DraftImage> CreateAsync(DraftImage draftImage);
    Task<DraftImage?> GetByFileNameAsync(string fileName);
    Task DeleteByFileNameAsync(string fileName);
}