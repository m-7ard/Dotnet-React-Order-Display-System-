import { genericRoutes } from "../routes/Route";
import RoutableException from "./RoutableException";

class NotFoundException extends RoutableException {
    constructor(message: string) {
        super(message, genericRoutes.NOT_FOUND_ERROR);
    }
}

export default NotFoundException;
