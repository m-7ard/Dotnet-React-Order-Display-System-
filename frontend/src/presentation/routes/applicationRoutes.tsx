import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import FrontpagePage from "../Application/Frontpage/FrontpagePage";

const frontPageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: FrontpagePage,
});

export default [
    frontPageRoute
]