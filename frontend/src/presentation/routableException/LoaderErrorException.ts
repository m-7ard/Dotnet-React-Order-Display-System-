import routeData from "../routes/_routeData";
import RoutableException from "./RoutableException";

class LoaderErrorException extends RoutableException {
    constructor(message: string) {
        super(message, routeData.loaderError.pattern);
    }
}

export default LoaderErrorException;
