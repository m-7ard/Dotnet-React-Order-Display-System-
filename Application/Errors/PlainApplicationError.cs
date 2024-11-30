namespace Application.ErrorHandling.Application;

public class PlainApplicationError
{
    public string Message { get; set; }
    public List<string> Path { get; set; }
    public string Code { get; set; }

    public PlainApplicationError(string message, List<string> path, string code)
    {
        Message = message;
        Path = path;
        Code = code;
    }
}