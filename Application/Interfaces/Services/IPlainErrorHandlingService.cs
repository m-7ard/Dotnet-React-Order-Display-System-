using Application.ErrorHandling.Api;

namespace Application.Interfaces.Services;

public interface IPlainErrorHandlingService : IApiErrorHandlingService<PlainApiError>
{
}