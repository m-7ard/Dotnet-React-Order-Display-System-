type RouteBuilder<T extends Record<string, unknown>> = (params: T) => string;

type Route<P extends string, T extends Record<string, unknown>> = {
    pattern: P;
    build: RouteBuilder<T>;
};

function createRoute<P extends string, T extends Record<string, unknown>>(
    pattern: P,
    build: RouteBuilder<T>,
): Route<P, T> {
    return { pattern, build };
}

const routeData = {
    frontpage: createRoute("/", () => "/"),
    ...{
        listOrders: createRoute("/orders", () => "/orders"),
        createOrder: createRoute("/orders/create", () => `/orders/create`),
        manageOrder: createRoute("/orders/$id/manage", (params: { id: number }) => `/orders/${params.id}/manage`),
    },
    ...{
        listProducts: createRoute("/products", () => "/products"),
        createProduct: createRoute("/products/create", () => `/products/create`),
        updateProduct: createRoute("/products/$id/update", (params: { id: number }) => `/products/${params.id}/update`),
    },

    ...{ listProductHistories: createRoute("/product_histories", () => "/product_histories") },
} as const;

export default routeData;
