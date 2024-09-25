import { PropsWithChildren } from "react";
import { CommandDispatcherContext } from "../contexts/CommandDispatcherContext";
import commandDispatcher from "../deps/commandDispatcher";
import { StateManagersContext } from "../contexts/StateManagersContext";
import { orderStateManager, productStateManager } from "../deps/stateManagers";
import ApplicationExceptionProvider from "./ApplicationExceptionProvider";
import GlobalDialogManager from "../components/Dialog/GlobalDialogManager";

export default function ApplicationProvider({ children }: PropsWithChildren) {
    return (
        <ApplicationExceptionProvider>
            <CommandDispatcherContext.Provider value={{ commandDispatcher: commandDispatcher }}>
                <StateManagersContext.Provider value={{ orderStateManager: orderStateManager, productStateManager: productStateManager }}>
                    <GlobalDialogManager>
                        {children}
                    </GlobalDialogManager>
                </StateManagersContext.Provider>
            </CommandDispatcherContext.Provider>
        </ApplicationExceptionProvider>
    );
}

