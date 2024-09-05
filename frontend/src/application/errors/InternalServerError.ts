export default class InternalServerError extends Error {
    constructor() {
        super("An internal server error of code 500 has occured.");
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}