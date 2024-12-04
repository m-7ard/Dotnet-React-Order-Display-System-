namespace Api.Errors;
public class ApiError
{
    public string Path { get; set; }
    public string Message { get; set; }
    public string FieldName { get; set; }

    public ApiError(string fieldName, string path, string message)
    {
        Path = path;
        Message = message;
        FieldName = fieldName;
    }
}