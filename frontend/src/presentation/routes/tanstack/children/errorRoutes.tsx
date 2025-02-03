import { createRoute } from "@tanstack/react-router";
import rootRoute from "../rootRoute";
import LoaderErrorPage from "../../../Application/Exceptions/LoaderErrorPage";
import UnknownErrorPage from "../../../Application/Exceptions/UnknownErrorPage";
import NotFoundErrorPage from "../../../Application/Exceptions/NotFoundErrorPage";
import InternalServerErrorPage from "../../../Application/Exceptions/InternalServerErrorPage";
import ClientSideErrorPage from "../../../Application/Exceptions/ClientSideErrorPage";
import routeConfig from "../routeConfig";

const loaderErrorPage = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.LOADER_ERROR.path,
    component: LoaderErrorPage,
});

const unkownErrorPage = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.UNKNOWN_ERROR.path,
    component: UnknownErrorPage,
});

const notFoundErrorPage = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.NOT_FOUND_ERROR.path,
    component: NotFoundErrorPage,
});

const internalServerErrorPage = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.INTERNAL_SERVER_ERROR.path,
    component: InternalServerErrorPage,
});

const clientSideErrorPage = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.CLIENT_SIDE_ERROR.path,
    component: ClientSideErrorPage,
});

export default [loaderErrorPage, unkownErrorPage, notFoundErrorPage, internalServerErrorPage, clientSideErrorPage];
