namespace Application.ErrorHandling.Application;

public class ApplicationErrorMetaData
{
    public string Message { get; set; }
    public List<string> Path { get; set; }

    public ApplicationErrorMetaData(Dictionary<string, object> metadata)
    {
        Message = (string)metadata["message"];
        Path = (List<string>)metadata["path"];
    }

    public ApplicationErrorMetaData(string message, List<string> path)
    {
        Message = message;
        Path = path;
    }

    public Dictionary<string, object> ToDictionary()
    {
        return new Dictionary<string, object>()
        {
            { "message", Message },
            { "path", Path }
        };
    }
}