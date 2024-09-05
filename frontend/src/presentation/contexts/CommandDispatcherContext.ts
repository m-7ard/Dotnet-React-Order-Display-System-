import ICommandDispatcher from "../../application/commands/ICommandDispatcher";
import createSafeContext from "../utils/createSafeContext";

export const [CommandDispatcherContext, useCommandDispatcherContext] = createSafeContext<{
    commandDispatcher: ICommandDispatcher;
}>("useCommandDispatcherContext must be used within CommandDispatcherContext.Provider.");