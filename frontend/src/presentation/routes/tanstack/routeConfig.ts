import ROUTE_KEYS from "../ROUTE_KEYS";
import routeKeys, { ExtractBuilderArgs } from "../routeKeys";

type TTanstackRouteConfig<T extends string, BuilderProps> = {
    path: T;
    builder: (props: BuilderProps) => string
};

const routeConfigs: { [K in keyof typeof routeKeys]: TTanstackRouteConfig<string, ExtractBuilderArgs<typeof routeKeys[K]>> } = {
    [routeKeys.FRONTPAGE]: { path: "", builder: (props: { deez: number }) => "" },


}

// Define individual route configurations with `as const`
const FRONT_PAGE = { path: "/" } as const;
const LIST_ORDERS = { path: "/orders" } as const;
const CREATE_ORDER = { path: "/orders/create" } as const;
const MANAGE_ORDER = { path: "/orders/$id/manage" } as const;

const LIST_PRODUCTS = { path: "/products" } as const;
const CREATE_PRODUCT = { path: "/products/create" } as const;
const UPDATE_PRODUCT = { path: "/products/$id/update" } as const;
const LIST_PRODUCT_HISTORIES = { path: "/product_histories" } as const;

const LOADER_ERROR = { path: "/loader_error" } as const;
const UNKNOWN_ERROR = { path: "/unknown_error" } as const;
const NOT_FOUND_ERROR = { path: "/not_found_error" } as const;
const INTERNAL_SERVER_ERROR = { path: "/internal_server_error" } as const;
const CLIENT_SIDE_ERROR = { path: "/client_side_error" } as const;

const routeConfig = {
    [ROUTE_KEYS.FRONTPAGE]: FRONT_PAGE,

    [ROUTE_KEYS.LIST_ORDERS]: LIST_ORDERS,
    [ROUTE_KEYS.CREATE_ORDER]: CREATE_ORDER,
    [ROUTE_KEYS.MANAGE_ORDER]: MANAGE_ORDER,

    [ROUTE_KEYS.LIST_PRODUCTS]: LIST_PRODUCTS,
    [ROUTE_KEYS.CREATE_PRODUCT]: CREATE_PRODUCT,
    [ROUTE_KEYS.UPDATE_PRODUCT]: UPDATE_PRODUCT,
    [ROUTE_KEYS.LIST_PRODUCT_HISTORIES]: LIST_PRODUCT_HISTORIES,

    [ROUTE_KEYS.LOADER_ERROR]: LOADER_ERROR,
    [ROUTE_KEYS.UNKNOWN_ERROR]: UNKNOWN_ERROR,
    [ROUTE_KEYS.NOT_FOUND_ERROR]: NOT_FOUND_ERROR,
    [ROUTE_KEYS.INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR,
    [ROUTE_KEYS.CLIENT_SIDE_ERROR]: CLIENT_SIDE_ERROR,
} as const satisfies Record<keyof typeof ROUTE_KEYS, TTanstackRouteConfig<string>>;

export default routeConfig;
