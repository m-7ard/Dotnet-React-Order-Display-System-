
using Application.ErrorHandling.Application;
using FluentValidation.Results;

namespace Application.Interfaces.Services;

public interface IApiErrorHandlingService<T>
{
    T CreateError(List<string> path, string message, string fieldName);
    List<T> FluentToApiErrors(List<ValidationFailure> validationFailures, List<string> path);
    List<T> TranslateServiceErrors(List<PlainApplicationError> errors);
}