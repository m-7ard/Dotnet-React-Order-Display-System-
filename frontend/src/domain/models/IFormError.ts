type IFormError<T> = {
    _: string[] | undefined;
} & {
    [K in keyof T]: T[K] extends string[]
        ? string[] | undefined
        : T[K] extends object
            ? IFormError<T[K]> | undefined
            : string[] | undefined;
};

export default IFormError;