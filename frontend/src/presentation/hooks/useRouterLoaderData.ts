import { useLoaderData } from "@tanstack/react-router";
import { IGenericRoutes, TAnyGenericRoute, TExtractGenericRouteLoaderData, genericRoutes } from "../routes/Route";

function useRouterLoaderData<T extends TAnyGenericRoute>(exp: (keys: IGenericRoutes) => T) {
    const data = useLoaderData({ from: exp(genericRoutes).config?.pattern as never });
    return data as TExtractGenericRouteLoaderData<T>;
}

export default useRouterLoaderData;
