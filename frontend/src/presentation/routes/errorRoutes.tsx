import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import routeData from "./_routeData";
import LoaderErrorPage from "../Application/Exceptions/LoaderErrorPage";
import UnknownErrorPage from "../Application/Exceptions/UnknownErrorPage";
import NotFoundErrorPage from "../Application/Exceptions/NotFoundErrorPage";
import InternalServerErrorPage from "../Application/Exceptions/InternalServerErrorPage";
import ClientSideErrorPage from "../Application/Exceptions/ClientSideErrorPage";

const loaderErrorPage = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.loaderError.pattern,
    component: LoaderErrorPage,
});

const unkownErrorPage = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.unkownError.pattern,
    component: UnknownErrorPage,
});

const notFoundErrorPage = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.notFoundError.pattern,
    component: NotFoundErrorPage,
});

const internalServerErrorPage = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.internalServerError.pattern,
    component: InternalServerErrorPage,
});

const clientSideErrorPage = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.clientSideError.pattern,
    component: ClientSideErrorPage,
});


export default [loaderErrorPage, unkownErrorPage, notFoundErrorPage, internalServerErrorPage, clientSideErrorPage];
