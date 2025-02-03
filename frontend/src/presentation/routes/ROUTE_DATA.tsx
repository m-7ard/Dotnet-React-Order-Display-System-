import ROUTE_KEYS from "./ROUTE_KEYS";

/* eslint-disable @typescript-eslint/no-explicit-any */
type RouteBuilder<T extends Record<string, string>> = (params: T) => string;

export class RouteData<
    TRouteGroupPattern extends string,
    RouteGroupBuilderArgs extends Record<string, string>,
    TLabel extends string
> {
    public children: RouteData<any, any, any>[] = [];

    public pattern: TRouteGroupPattern;
    public build: RouteBuilder<RouteGroupBuilderArgs>;
    public label?: TLabel;
    public parent?: RouteData<any, any, any>;
    public isLayout: boolean;

    constructor(config: {
        pattern: TRouteGroupPattern;
        build: RouteBuilder<RouteGroupBuilderArgs>;
        label?: TLabel;
        parent?: RouteData<any, any, any>;
        isLayout?: boolean
    }) {
        this.pattern = config.pattern;
        this.build = config.build;
        this.label = config.label;
        this.parent = config.parent;
        this.isLayout = config.isLayout ?? false;
    }

    registerRoute<P extends string, Args extends Record<string, string>, L extends string>(
        config: {
            pattern: P;
            build: RouteBuilder<Args>;
            label?: L;
            isLayout?: boolean
        }
    ) {
        const route = new RouteData({
            pattern: `${this.pattern}/${config.pattern}`,
            build: (props: RouteGroupBuilderArgs & Args) => `${this.build(props)}/${config.build(props)}`,
            label: config.label,
            isLayout: config.isLayout ?? false,
            parent: this,
        });

        this.children.push(route);
        return route;
    }
}

const baseRouterGroup = new RouteData({
    pattern: "",
    build: () => "",
    label: "All",
    isLayout: true
});

// frontpage
const frontpageRoute = baseRouterGroup.registerRoute({
    pattern: "",
    build: () => "",
    label: "Frontpage",
});

// orders
const __ordersRoute = baseRouterGroup.registerRoute({
    pattern: "orders",
    build: () => "orders",
    label: "Orders",
    isLayout: true
});
const listOrdersRoute = __ordersRoute.registerRoute({ pattern: "", build: () => "" });
const createOrderRoute = __ordersRoute.registerRoute({ pattern: "create", build: () => "create", label: "Create" });

const __ordersIdRoute = __ordersRoute.registerRoute({
    pattern: "$id",
    build: ({ id }: { id: string }) => id,
    label: "$id",
    isLayout: true
});
const manageOrderRoute = __ordersIdRoute.registerRoute({
    pattern: "manage",
    build: () => "manage",
    label: "Manage",
});

// products
const __productsRoute = baseRouterGroup.registerRoute({
    pattern: "products",
    build: () => "products",
    label: "Products",
    isLayout: true
});
const listProductsRoute = __productsRoute.registerRoute({ pattern: "", build: () => "" });
const createProductRoute = __productsRoute.registerRoute({
    pattern: "create",
    build: () => "create",
    label: "Create",
});

const __productIdRoute = __productsRoute.registerRoute({
    pattern: "$id",
    build: ({ id }: { id: string }) => id,
    label: "$id",
    isLayout: true
});
const updateProductRoute = __productIdRoute.registerRoute({
    pattern: "update",
    build: () => "update",
    label: "Update",
});

// product histories
const __productHistoriesRoute = baseRouterGroup.registerRoute({
    pattern: "product_histories",
    build: () => "product_histories",
    label: "Product Histories",
    isLayout: true
});
const listProductHistoriesRoute = __productHistoriesRoute.registerRoute({ pattern: "", build: () => "" });

// error pages
const loaderErrorRoute = baseRouterGroup.registerRoute({ pattern: "loader_error", build: () => "loader_error" });
const unkownErrorRoute = baseRouterGroup.registerRoute({ pattern: "unknown_error", build: () => "unknown_error" });
const notFoundErrorRoute = baseRouterGroup.registerRoute({ pattern: "not_found_error", build: () => "not_found_error" });
const internalServerErrorRoute = baseRouterGroup.registerRoute({
    pattern: "internal_server_error",
    build: () => "internal_server_error",
});
const clientSideErrorRoute = baseRouterGroup.registerRoute({
    pattern: "client_side_error",
    build: () => "client_side_error",
});

const ROUTE_DATA = {
    [ROUTE_KEYS.FRONTPAGE]: frontpageRoute,

    ...{
        [ROUTE_KEYS.LIST_ORDERS]: listOrdersRoute,
        [ROUTE_KEYS.CREATE_ORDER]: createOrderRoute,
        [ROUTE_KEYS.MANAGE_ORDER]: manageOrderRoute,
    },

    ...{
        [ROUTE_KEYS.LIST_PRODUCTS]: listProductsRoute,
        [ROUTE_KEYS.CREATE_PRODUCT]: createProductRoute,
        [ROUTE_KEYS.UPDATE_PRODUCT]: updateProductRoute,
    },

    ...{ [ROUTE_KEYS.LIST_PRODUCT_HISTORIES]: listProductHistoriesRoute },

    ...{
        [ROUTE_KEYS.LOADER_ERROR]: loaderErrorRoute,
        [ROUTE_KEYS.UNKNOWN_ERROR]: unkownErrorRoute,
        [ROUTE_KEYS.NOT_FOUND_ERROR]: notFoundErrorRoute,
        [ROUTE_KEYS.INTERNAL_SERVER_ERROR]: internalServerErrorRoute,
        [ROUTE_KEYS.CLIENT_SIDE_ERROR]: clientSideErrorRoute,
    },
}  as const satisfies Record<keyof typeof ROUTE_KEYS, RouteData<any, any, any>>;

export default ROUTE_DATA;
