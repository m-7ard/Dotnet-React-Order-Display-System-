type RouteBuilder<T extends Record<string, unknown>> = (params: T) => string;

type Route<P extends string, T extends Record<string, unknown>> = {
    pattern: P;
    build: RouteBuilder<T>;
};

function createRoute<P extends string, T extends Record<string, unknown>>(pattern: P, build: RouteBuilder<T>): Route<P, T> {
    return { pattern, build };
}

const routeData = {
    frontpage: createRoute("/", () => "/"),

    ...{
        listOrders: createRoute("/orders", () => "/orders"),
        createOrder: createRoute("/orders/create", () => `/orders/create`),
        manageOrder: createRoute("/orders/$id/manage", (params: { id: string }) => `/orders/${params.id}/manage`),
    },

    ...{
        listProducts: createRoute("/products", () => "/products"),
        createProduct: createRoute("/products/create", () => `/products/create`),
        updateProduct: createRoute("/products/$id/update", (params: { id: string }) => `/products/${params.id}/update`),
    },

    ...{ listProductHistories: createRoute("/product_histories", () => "/product_histories") },

    ...{
        loaderError: createRoute("/loader_error", () => "/loader_error"),
        unkownError: createRoute("/unknown_error", () => "/unknown_error"),
        notFoundError: createRoute("/not_found_error", () => "/not_found_error"),
        internalServerError: createRoute("/internal_server_error", () => "/internal_server_error"),
        clientSideError: createRoute("/client_side_error", () => "/client_side_error"),
    },
} as const;

export default routeData;
