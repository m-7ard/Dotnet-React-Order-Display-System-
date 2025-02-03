import ROUTE_DATA from '../routes/ROUTE_DATA';
import RoutableException from './RoutableException';

class InternalServerErrorException extends RoutableException {
    constructor(message: string) {
        super(message, ROUTE_DATA.internalServerError.pattern);
    }
}

export default InternalServerErrorException;