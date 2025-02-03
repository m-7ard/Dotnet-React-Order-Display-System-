import { useLoaderData } from "@tanstack/react-router";
import ROUTE_KEYS from "../routes/ROUTE_KEYS";
import routeConfig from "../routes/tanstack/routeConfig";

type TRouteKeys = typeof ROUTE_KEYS;

function useRouterLoaderData<T>(exp: (keys: TRouteKeys) => TRouteKeys[keyof TRouteKeys]) {
    // TODO: make this into a function such as useTanstackLoaderData
    const data = useLoaderData({ from: routeConfig[exp(ROUTE_KEYS)].path });
    return data as T;
}

export default useRouterLoaderData;