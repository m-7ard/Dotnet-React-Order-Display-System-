
using Application.Common;
using Application.ErrorHandling.Application;
using Application.Interfaces.Services;
using FluentValidation.Results;

namespace Application.ErrorHandling.Api;

public class PlainApiErrorHandlingService : IPlainErrorHandlingService
{
    // "_" = form error
    // "field" = field error
    // "field/_" = field form error
    public PlainApiError CreateError(List<string> path, string message, string fieldName)
    {
        return new PlainApiError(
            fieldName: fieldName,
            path: string.Join("/", path),
            message: message
        );
    }

    public List<PlainApiError> FluentToApiErrors(List<ValidationFailure> validationFailures, List<string> path)
    {
        return validationFailures.Select((error) =>
        {
            var camelCaseFieldName = StringCaseConverter.ToCamelCase(error.PropertyName);
            var fullPath = path.Count == 0
                ? camelCaseFieldName
                : $"/{camelCaseFieldName}/{string.Join("/", path)}";

            return new PlainApiError(
                fieldName: camelCaseFieldName,
                path: fullPath,
                message: error.ErrorMessage
            );
        }).ToList();
    }

    public List<PlainApiError> TranslateServiceErrors(List<PlainApplicationError> errors)
    {
        return errors.Select((error) =>
        {
            return new PlainApiError(
                fieldName: error.Path[0],
                path: string.Join("/", error.Path),
                message: error.Message
            );
        }).ToList();
    }
}