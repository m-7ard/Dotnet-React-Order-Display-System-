using Domain.Models;
using OneOf;

namespace Application.Interfaces.Services;

public interface IDraftImageDomainService
{
    Task<OneOf<DraftImage, string>> GetDraftImageByFileName(string fileName);
}