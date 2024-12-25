import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import routeData from "./_routeData";
import FrontpagePage from "../Application/Frontpage/Frontpage.Page";

const frontPageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.frontpage.pattern,
    component: FrontpagePage,
});

export default [
    frontPageRoute
]