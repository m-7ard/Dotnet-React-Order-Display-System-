/* eslint-disable @typescript-eslint/no-explicit-any */
type RouteBuilder<T extends Record<string, unknown>> = (params: T) => string;

type Route<P extends string, T extends Record<string, unknown>> = {
    pattern: P;
    build: RouteBuilder<T>;
};

function createRoute<P extends string, T extends Record<string, unknown>>(pattern: P, build: RouteBuilder<T>): Route<P, T> {
    return { pattern, build };
}

class RouteData<TRouteGroupPattern extends string, RouteGroupBuilderArgs extends Record<string, unknown>, TLabel extends string> {
    public children: RouteData<any, any, any>[] = [];

    constructor(
        public pattern: TRouteGroupPattern,
        public build: RouteBuilder<RouteGroupBuilderArgs>,
        public label?: TLabel,
        public parent?: RouteData<any, any, any>
    ) {}

    registerRoute<P extends string, Args extends Record<string, unknown>, L extends string>(pattern: P, build: RouteBuilder<Args>, label?: L) {
        const route = new RouteData(`${this.pattern}/${pattern}`, (props: RouteGroupBuilderArgs & Args) => `${this.build(props)}/${build(props)}`, label, this);
        this.children.push(route)
        return route;
    }
}

const baseRouterGroup = new RouteData("", () => "", "All");

// frontpage
const frontpageRoute = baseRouterGroup.registerRoute("", () => "", "Frontpage");

// orders
const __ordersRoute = baseRouterGroup.registerRoute("orders", () => "orders", "Orders");
const listOrdersRoute = __ordersRoute.registerRoute("", () => "")
const createOrderRoute = __ordersRoute.registerRoute("create", () => "create", "Create")

const __ordersIdRoute = __ordersRoute.registerRoute("$id", ({ id }: { id: string }) => id, "$id")
const manageOrderRoute = __ordersIdRoute.registerRoute("manage", () => "manage", "Manage");

// products
const __productsRoute = baseRouterGroup.registerRoute("products", () => "products", "Products");
const listProductsRoute = __productsRoute.registerRoute("", () => "")
const createProductRoute = __productsRoute.registerRoute("create", () => "create", "Create")

const __productIdRoute = __productsRoute.registerRoute("$id", ({ id }: { id: string }) => id, "$id")
const updateProductRoute = __productIdRoute.registerRoute("update", () => "update", "Update");

// product histories
const __productHistoriesRoute = baseRouterGroup.registerRoute("product_histories", () => "product_histories", "Product Histories");
const listProductHistoriesRoute = __productHistoriesRoute.registerRoute("", () => "")

// error pages
const loaderErrorRoute = baseRouterGroup.registerRoute("loader_error", () => "loader_error")
const unkownErrorRoute = baseRouterGroup.registerRoute("unknown_error", () => "unknown_error")
const notFoundErrorRoute = baseRouterGroup.registerRoute("not_found_error", () => "not_found_error")
const internalServerErrorRoute = baseRouterGroup.registerRoute("internal_server_error", () => "internal_server_error")
const clientSideErrorRoute = baseRouterGroup.registerRoute("client_side_error", () => "client_side_error")


const routeData = {
    frontpage: frontpageRoute,

    ...{
        listOrders: listOrdersRoute,
        createOrder: createOrderRoute,
        manageOrder: manageOrderRoute
    },

    ...{
        listProducts: listProductsRoute,
        createProduct: createProductRoute,
        updateProduct: updateProductRoute,
    },

    ...{ listProductHistories: listProductHistoriesRoute },

    ...{
        loaderError: loaderErrorRoute,
        unkownError: unkownErrorRoute,
        notFoundError: notFoundErrorRoute,
        internalServerError: internalServerErrorRoute,
        clientSideError: clientSideErrorRoute,
    },
} as const;

export default routeData;
