import ROUTE_DATA from "../routes/ROUTE_DATA";
import RoutableException from "./RoutableException";

class LoaderErrorException extends RoutableException {
    constructor(message: string) {
        super(message, ROUTE_DATA.loaderError.pattern);
    }
}

export default LoaderErrorException;
