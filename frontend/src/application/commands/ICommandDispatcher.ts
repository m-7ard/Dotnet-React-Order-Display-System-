/* eslint-disable @typescript-eslint/no-explicit-any */
import ICommand from "./ICommand";
import { ICommandHandler } from "./ICommandHandler";

export default interface ICommandDispatcher {
    registerHandler<TCommand extends ICommand<TResult>, TResult>(
        commandType: new (...args: any[]) => TCommand,
        handler: ICommandHandler<TCommand, TResult>,
    ): void;

    dispatch<TResult>(command: ICommand<TResult>): Promise<TResult>;
}
