using Api.Errors;

namespace Api.Interfaces;

public interface IPlainErrorHandlingService : IApiErrorHandlingService<PlainApiError>
{
}