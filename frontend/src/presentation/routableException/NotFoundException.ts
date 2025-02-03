import ROUTE_DATA from "../routes/ROUTE_DATA";
import RoutableException from "./RoutableException";

class NotFoundException extends RoutableException {
    constructor(message: string) {
        super(message, ROUTE_DATA.notFoundError.pattern);
    }
}

export default NotFoundException;
