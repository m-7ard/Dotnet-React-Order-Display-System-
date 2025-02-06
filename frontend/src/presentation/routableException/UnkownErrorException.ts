import { genericRoutes } from '../routes/Route';
import RoutableException from './RoutableException';

class UnkownErrorException extends RoutableException {
    constructor(message: string) {
        super(message, genericRoutes.UNKNOWN_ERROR);
    }
}

export default UnkownErrorException;