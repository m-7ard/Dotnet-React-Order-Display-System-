export default class UnkownError extends Error {
    constructor({ message }: { message?: string }) {
        super(`An unkown error has occured.${message == null ? ' Error has no message.' : ` Error contains message ${message}`}`);
        Object.setPrototypeOf(this, UnkownError.prototype);
    }
}