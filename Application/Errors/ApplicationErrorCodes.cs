namespace Application.Errors;

public class ApplicationErrorCodes
{
    public const string IsNull = "IsNull";
    public const string StateMismatch = "StateMismatch";
    public const string ModelDoesNotExist = "ModelDoesNotExist";
    public const string IntegrityError = "IntegrityError";
    public const string ModelAlreadyExists = "ModelAlreadyExists";
    public const string Custom = "Custom";
    public const string FileSizeExceeded = "FileSizeExceeded";
    public const string FileInvalidExtension = "FileInvalidExtension";
    public const string FileCountExceeded = "FileCountExceeded";
    public const string FileNoFiles = "FileNoFiles";
    public const string DomainError = "DomainError";
    public const string NotAllowed = "NotAllowed";
    public const string OperationFailed = "OperationFailed";
}