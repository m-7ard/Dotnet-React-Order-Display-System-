export default interface IExceptionService {
    dispatchException: (error: unknown) => void;
    exception: Error | null;
    dismissException: () => void;
}
