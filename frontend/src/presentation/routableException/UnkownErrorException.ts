import ROUTE_DATA from '../routes/ROUTE_DATA';
import RoutableException from './RoutableException';

class UnkownErrorException extends RoutableException {
    constructor(message: string) {
        super(message, ROUTE_DATA.unkownError.pattern);
    }
}

export default UnkownErrorException;