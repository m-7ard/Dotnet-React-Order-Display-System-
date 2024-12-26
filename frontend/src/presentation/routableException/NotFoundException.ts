import routeData from "../routes/_routeData";
import RoutableException from "./RoutableException";

class NotFoundException extends RoutableException {
    constructor(message: string) {
        super(message, routeData.notFoundError.pattern);
    }
}

export default NotFoundException;
