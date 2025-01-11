import routeData from '../routes/_routeData';
import RoutableException from './RoutableException';

class ClientSideErrorException extends RoutableException {
    constructor(message: string) {
        super(message, routeData.clientSideError.pattern);
    }
}

export default ClientSideErrorException;