import { genericRoutes } from "../routes/Route";
import RoutableException from "./RoutableException";

class LoaderErrorException extends RoutableException {
    constructor(message: string) {
        super(message, genericRoutes.LOADER_ERROR);
    }
}

export default LoaderErrorException;
