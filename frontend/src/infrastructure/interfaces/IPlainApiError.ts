type IPlainApiError = Array<{
    fieldName: string,
    path: string,
    message: string,
}>;

export default IPlainApiError;
