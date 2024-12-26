import RoutableException from './RoutableException';

class UnkownErrorException extends RoutableException {
    constructor(message: string) {
        super(message, '/unkown-error/');
    }
}

export default UnkownErrorException;