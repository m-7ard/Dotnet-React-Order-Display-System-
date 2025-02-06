import { genericRoutes } from '../routes/Route';
import RoutableException from './RoutableException';

class ClientSideErrorException extends RoutableException {
    constructor(message: string) {
        super(message, genericRoutes.CLIENT_SIDE_ERROR);
    }
}

export default ClientSideErrorException;