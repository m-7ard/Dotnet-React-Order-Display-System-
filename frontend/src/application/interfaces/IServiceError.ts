type IServiceError<T> = {
    _?: string[];
} & {
    [K in keyof T]: T[K] extends string[]
        ? string[]
        : T[K] extends object
            ? IServiceError<T[K]>
            : string[] | undefined;
};

export default IServiceError;