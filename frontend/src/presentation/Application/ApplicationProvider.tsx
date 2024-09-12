import { PropsWithChildren, useCallback, useState } from "react";
import { CommandDispatcherContext } from "../contexts/CommandDispatcherContext";
import commandDispatcher from "../deps/commandDispatcher";
import { ApplicationExceptionContext } from "../contexts/ApplicationExceptionHandlerContext";
import InternalServerError from "../../application/errors/InternalServerError";
import UnknownError from "../../application/errors/UnkownError";
import { StateManagersContext } from "../contexts/StateManagersContext";
import { orderStateManager } from "../deps/stateManagers";

export default function ApplicationProvider({ children }: PropsWithChildren) {
    return (
        <ApplicationExceptionProvider>
            <CommandDispatcherContext.Provider value={{ commandDispatcher: commandDispatcher }}>
                <StateManagersContext.Provider value={{ orderStateManager: orderStateManager }}>
                    {children}
                </StateManagersContext.Provider>
            </CommandDispatcherContext.Provider>
        </ApplicationExceptionProvider>
    );
}

function ApplicationExceptionProvider({ children }: PropsWithChildren) {
    const [exception, setException] = useState<Error | null>(null);
    const dispatchException = useCallback((error: unknown) => {
        if (error instanceof InternalServerError) {
            setException(error);
        } else if (error instanceof Error) {
            setException(new UnknownError({ message: error.message }));
        } else {
            setException(new UnknownError({}));
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
