/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidTanstackRoutes } from "../deps/router";
import { RouteHierarchy } from "./ROUTE_DATA"

class RouteMapper {
    static AgnosticToTanstackPath(route: RouteHierarchy<any, any, any>): ValidTanstackRoutes {
        const { pattern } = route;
        return (pattern.endsWith("/") ? pattern.slice(0, -1) : pattern) as ValidTanstackRoutes;
    }
}

export default RouteMapper;