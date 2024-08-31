namespace Application.ErrorHandling.Api;
public class PlainApiError
{
    public string Path { get; set; }
    public string Message { get; set; }
    public string FieldName { get; set; }

    public PlainApiError(string fieldName, string path, string message)
    {
        Path = path;
        Message = message;
        FieldName = fieldName;
    }
}