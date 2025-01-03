using Application.Errors;
using FluentValidation.Results;

namespace Api.Interfaces;

public interface IApiErrorHandlingService<T>
{
    T CreateError(List<string> path, string message, string fieldName);
    List<T> FluentToApiErrors(List<ValidationFailure> validationFailures, List<string> path);
    List<T> TranslateServiceErrors(List<ApplicationError> errors);
}