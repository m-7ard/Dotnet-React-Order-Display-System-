import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import FrontpagePage from "../Application/Frontpage/FrontpagePage";
import routeData from "./_routeData";

const frontPageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.frontpage.pattern,
    component: FrontpagePage,
});

export default [
    frontPageRoute
]