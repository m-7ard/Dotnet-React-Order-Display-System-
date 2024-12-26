import routeData from "../routes/_routeData";

type routePattern = (typeof routeData)[keyof typeof routeData]["pattern"];

class RoutableException extends Error {
    constructor(message: string, route: routePattern) {
        super(message);
        this.route = route;
        this.name = this.constructor.name;
    }

    public route: routePattern;
}

export default RoutableException;
