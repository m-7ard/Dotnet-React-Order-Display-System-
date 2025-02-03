import ROUTE_DATA from "../routes/ROUTE_DATA";

type routePattern = (typeof ROUTE_DATA)[keyof typeof ROUTE_DATA]["pattern"];

class RoutableException extends Error {
    constructor(message: string, route: routePattern) {
        super(message);
        this.route = route;
        this.name = this.constructor.name;
    }

    public route: routePattern;
}

export default RoutableException;
