import { createRootRoute } from "@tanstack/react-router";
import ApplicationLayout from "../Application/ApplicationLayout";

const rootRoute = createRootRoute({
    component: () => <ApplicationLayout />,
});

export default rootRoute;