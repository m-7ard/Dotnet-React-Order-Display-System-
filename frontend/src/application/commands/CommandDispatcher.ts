/* eslint-disable @typescript-eslint/no-explicit-any */
import ICommand from "./ICommand";
import { ICommandHandler } from "./ICommandHandler";

export default class CommandDispatcher {
    private handlers: Map<string, ICommandHandler<any, any>> = new Map();

    registerHandler<TCommand extends ICommand<TResult>, TResult>(
        commandType: new (...args: any[]) => TCommand,
        handler: ICommandHandler<TCommand, TResult>,
    ) {
        this.handlers.set(commandType.name, handler);
    }

    dispatch<TCommand extends ICommand<TResult>, TResult>(command: TCommand): Promise<TCommand["__returnType"]> {
        const handler = this.handlers.get(command.constructor.name);

        if (!handler) {
            const error = new Error(`No handler registered for ${command.constructor.name}`);
            console.error(error);
            throw error;
        }

        return handler.handle(command);
    }
}
