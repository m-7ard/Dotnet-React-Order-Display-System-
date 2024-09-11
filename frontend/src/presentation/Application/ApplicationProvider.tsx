import { PropsWithChildren, useCallback, useState } from "react";
import { CommandDispatcherContext } from "../contexts/CommandDispatcherContext";
import commandDispatcher from "../deps/commandDispatcher";
import { ApplicationExceptionContext } from "../contexts/ApplicationExceptionHandlerContext";
import InternalServerError from "../../application/errors/InternalServerError";
import UnkownError from "../../application/errors/UnkownError";

export default function ApplicationProvider({ children }: PropsWithChildren) {
    return (
        <CommandDispatcherContext.Provider value={{ commandDispatcher: commandDispatcher }}>
            <ApplicationExceptionProvider>{children}</ApplicationExceptionProvider>
        </CommandDispatcherContext.Provider>
    );
}

function ApplicationExceptionProvider({ children }: PropsWithChildren) {
    const [exception, setException] = useState<Error | null>(null);
    const dispatchException = useCallback((error: unknown) => {
        if (error instanceof InternalServerError) {
            setException(error);
        } else if (error instanceof Error) {
            setException(new UnkownError({ message: error.message }));
        } else {
            setException(new UnkownError({}));
        }

        console.warn(error);
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
