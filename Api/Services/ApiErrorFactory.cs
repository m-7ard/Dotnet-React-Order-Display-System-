
using Api.Errors;
using Application.Common;
using Application.Errors;
using FluentValidation.Results;

namespace Api.Services;

public class ApiErrorFactory
{
    // "_" = form error
    // "field" = field error
    // "field/_" = field form error
    public static PlainApiError CreateError(List<string> path, string message, string fieldName)
    {
        return new PlainApiError(
            fieldName: fieldName,
            path: string.Join("/", path),
            message: message
        );
    }

    public static List<PlainApiError> FluentToApiErrors(List<ValidationFailure> validationFailures, List<string> path)
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

    public static List<PlainApiError> TranslateServiceErrors(List<ApplicationError> errors)
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