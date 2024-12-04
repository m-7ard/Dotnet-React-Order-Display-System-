using Application.Common;
using Application.Errors;
using FluentValidation.Results;

namespace Api.Errors;

public class ApiErrorFactory
{
    // "_" = form error
    // "field" = field error
    // "field/_" = field form error
    public static ApiError CreateError(List<string> path, string message, string fieldName)
    {
        return new ApiError(
            fieldName: fieldName,
            path: string.Join("/", path),
            message: message
        );
    }

    public static List<ApiError> FluentToApiErrors(List<ValidationFailure> validationFailures, List<string> path)
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

    public static List<ApiError> TranslateApplicationErrors(List<ApplicationError> errors)
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