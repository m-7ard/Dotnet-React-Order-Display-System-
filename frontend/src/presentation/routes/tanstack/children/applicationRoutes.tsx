import { createRoute } from "@tanstack/react-router";
import rootRoute from "../rootRoute";
import FrontpagePage from "../../../Application/Frontpage/Frontpage.Page";
import routeConfig from "../routeConfig";

const frontPageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.FRONTPAGE.path,
    component: FrontpagePage,
});

export default [
    frontPageRoute
]