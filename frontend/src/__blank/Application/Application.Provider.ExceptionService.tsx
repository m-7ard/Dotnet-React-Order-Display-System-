import { PropsWithChildren, useCallback, useState } from "react";
import InternalServerError from "../../presentation/errors/InternalServerError";
import UnknownError from "../../presentation/errors/UnkownError";
import { ApplicationExceptionContext } from "./Application.Exception.Context";

export default function ExceptionService({ children }: PropsWithChildren) {
    const [exception, setException] = useState<Error | null>(null);
    const dispatchException = useCallback((error: unknown) => {
        if (error instanceof InternalServerError) {
            setException(error);
        } else if (error instanceof Error) {
            setException(new UnknownError({ message: error.message }));
        } else {
            setException(new UnknownError({}));
        }

        console.error(error);
    }, []);
    const dismissException = useCallback(() => setException(null), []);

    return (
        <ApplicationExceptionContext.Provider
            value={{
                dispatchException: dispatchException,
                exception: exception,
                dismissException: dismissException,
            }}
        >
            {children}
        </ApplicationExceptionContext.Provider>
    );
}