import { createRoute, redirect } from "@tanstack/react-router";
import rootRoute from "../rootRoute";
import LoaderErrorPage from "../../../Application/Exceptions/LoaderErrorPage";
import UnknownErrorPage from "../../../Application/Exceptions/UnknownErrorPage";
import NotFoundErrorPage from "../../../Application/Exceptions/NotFoundErrorPage";
import InternalServerErrorPage from "../../../Application/Exceptions/InternalServerErrorPage";
import ClientSideErrorPage from "../../../Application/Exceptions/ClientSideErrorPage";
import { ErrorPageLoaderData, tanstackConfigs } from "../../Route";
import TanstackRouterState from "../../../types/TanstackRouterState";

const loaderErrorPage = createRoute({
    loader: (ctx): ErrorPageLoaderData => {
        const state: TanstackRouterState | undefined = ctx.route.router?.state;
        const error = state?.location.state.error;

        if (error == null) {
            throw redirect({ to: tanstackConfigs.CLIENT_SIDE_ERROR.build({}), state: (prev) => ({ ...prev, error: new Error("A loader error occured but no error was provided to the LoaderErrorPage.") }) });
        }

        return { error: error };
    },
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.LOADER_ERROR.pattern,
    component: LoaderErrorPage,
});

const unkownErrorPage = createRoute({
    loader: (ctx): ErrorPageLoaderData => {
        const state: TanstackRouterState | undefined = ctx.route.router?.state;
        const error = state?.location.state.error;

        if (error == null) {
            throw redirect({ to: tanstackConfigs.CLIENT_SIDE_ERROR.build({}), state: (prev) => ({ ...prev, error: new Error("An Unknown Error occured but no error was provided to the UnknownErrorPage.") }) });
        }

        return { error: error };
    },
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.UNKNOWN_ERROR.pattern,
    component: UnknownErrorPage,
});

const notFoundErrorPage = createRoute({
    loader: (ctx): ErrorPageLoaderData => {
        const state: TanstackRouterState | undefined = ctx.route.router?.state;
        const error = state?.location.state.error;

        if (error == null) {
            throw redirect({ to: tanstackConfigs.CLIENT_SIDE_ERROR.build({}), state: (prev) => ({ ...prev, error: new Error("An 404 Not Found error occured but no error was provided to the NotFoundErrorPage.") }) });
        }

        return { error: error };
    },
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.NOT_FOUND_ERROR.pattern,
    component: NotFoundErrorPage,
});

const internalServerErrorPage = createRoute({
    loader: (ctx): ErrorPageLoaderData => {
        const state: TanstackRouterState | undefined = ctx.route.router?.state;
        const error = state?.location.state.error;

        if (error == null) {
            throw redirect({ to: tanstackConfigs.CLIENT_SIDE_ERROR.build({}), state: (prev) => ({ ...prev, error: new Error("An 404 Not Found error occured but no error was provided to the NotFoundErrorPage.") }) });
        }

        return { error: error };
    },
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.INTERNAL_SERVER_ERROR.pattern,
    component: InternalServerErrorPage,
});

const clientSideErrorPage = createRoute({
    loader: (ctx): ErrorPageLoaderData => {
        const state: TanstackRouterState | undefined = ctx.route.router?.state;
        const error = state?.location.state.error;

        if (error == null) {
            throw redirect({ to: tanstackConfigs.CLIENT_SIDE_ERROR.build({}), state: (prev) => ({ ...prev, error: new Error("An Client Side error occured but no error was provided to the ClientSideErrorPage.") }) });
        }

        return { error: error };
    },
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.CLIENT_SIDE_ERROR.pattern,
    component: ClientSideErrorPage,
});

export default [loaderErrorPage, unkownErrorPage, notFoundErrorPage, internalServerErrorPage, clientSideErrorPage];
