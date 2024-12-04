
namespace Domain.Errors;

public class DomainErrorFactory
{
    public static List<DomainError> CreateSingleListError(string message, List<string> path, string code)
    {
        return new List<DomainError>()
        {
            new DomainError(
                message: message,
                path: path,
                code: code
            )
        };
    }

    internal static void CreateSingleListError(string message, object path, object code)
    {
        throw new NotImplementedException();
    }
}