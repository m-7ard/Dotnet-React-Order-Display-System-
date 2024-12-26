import routeData from '../routes/_routeData';
import RoutableException from './RoutableException';

class InternalServerErrorException extends RoutableException {
    constructor(message: string) {
        super(message, routeData.internalServerError.pattern);
    }
}

export default InternalServerErrorException;