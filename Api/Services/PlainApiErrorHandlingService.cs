
using Api.Errors;
using Api.Interfaces;
using Application.Common;
using Application.Errors;
using FluentValidation.Results;

namespace Api.Services;

public class PlainApiErrorHandlingService : IPlainErrorHandlingService
{
    // "_" = form error
    // "field" = field error
    // "field/_" = field form error
    public ApiError CreateError(List<string> path, string message, string fieldName)
    {
        return new ApiError(
            fieldName: fieldName,
            path: string.Join("/", path),
            message: message
        );
    }

    public List<ApiError> FluentToApiErrors(List<ValidationFailure> validationFailures, List<string> path)
    {
        return validationFailures.Select((error) =>
        {
            var camelCaseFieldName = StringCaseConverter.ToCamelCase(error.PropertyName);
            var fullPath = path.Count == 0
                ? camelCaseFieldName
                : $"/{camelCaseFieldName}/{string.Join("/", path)}";

            return new ApiError(
                fieldName: camelCaseFieldName,
                path: fullPath,
                message: error.ErrorMessage
            );
        }).ToList();
    }

    public List<ApiError> TranslateServiceErrors(List<ApplicationError> errors)
    {
        return errors.Select((error) =>
        {
            return new ApiError(
                fieldName: error.Path[0],
                path: string.Join("/", error.Path),
                message: error.Message
            );
        }).ToList();
    }
}