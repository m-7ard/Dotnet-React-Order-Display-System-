import { TAnyGenericRoute } from "../routes/Route";

class RoutableException extends Error {
    constructor(message: string, route: TAnyGenericRoute) {
        super(message);
        this.route = route;
        this.name = this.constructor.name;
    }

    public route: TAnyGenericRoute;
}

export default RoutableException;
