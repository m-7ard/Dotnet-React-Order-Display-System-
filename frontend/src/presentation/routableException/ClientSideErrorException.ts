import ROUTE_DATA from '../routes/ROUTE_DATA';
import RoutableException from './RoutableException';

class ClientSideErrorException extends RoutableException {
    constructor(message: string) {
        super(message, ROUTE_DATA.clientSideError.pattern);
    }
}

export default ClientSideErrorException;