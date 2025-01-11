import routeData from '../routes/_routeData';
import RoutableException from './RoutableException';

class UnkownErrorException extends RoutableException {
    constructor(message: string) {
        super(message, routeData.unkownError.pattern);
    }
}

export default UnkownErrorException;