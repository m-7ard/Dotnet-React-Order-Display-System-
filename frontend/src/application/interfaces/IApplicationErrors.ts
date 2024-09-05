import IPlainApiError from "./IPlainApiError"

interface ApplicationErrorType<Name, DataT> {
    type: Name,
    data: DataT
}

type ApiErrorType = ApplicationErrorType<"API", IPlainApiError>;
type ServiceErrorType = ApplicationErrorType<"Service", Array<{
    message: string,
    field: string
}>>;
type ExcpetionErrorType = ApplicationErrorType<"Exception", unknown>;

type IApplicationErrors = ApiErrorType | ServiceErrorType | ExcpetionErrorType;

export default IApplicationErrors;