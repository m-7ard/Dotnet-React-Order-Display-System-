import { genericRoutes } from '../routes/Route';
import RoutableException from './RoutableException';

class InternalServerErrorException extends RoutableException {
    constructor(message: string) {
        super(message, genericRoutes.INTERNAL_SERVER_ERROR);
    }
}

export default InternalServerErrorException;