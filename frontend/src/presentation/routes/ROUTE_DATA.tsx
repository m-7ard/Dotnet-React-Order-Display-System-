import routeKeys from "./routeKeys";

/* eslint-disable @typescript-eslint/no-explicit-any */
type RouteBuilder<T extends Record<string, string>> = (params: T) => string;

export class RouteHierarchy<TKey extends typeof routeKeys[keyof typeof routeKeys]> {
    public key?: TKey;
    public label?: string;
    public parent?: RouteHierarchy<typeof routeKeys[keyof typeof routeKeys]>;
    
    constructor(props: {
        key?: TKey
        label?: string;
        parent?: RouteHierarchy<typeof routeKeys[keyof typeof routeKeys]>;
    }) {
        this.key = props.key;
        this.label = props.label;
        this.parent = props.parent;
    }

    registerRoute<K extends typeof routeKeys[keyof typeof routeKeys]>(props: {
        key?: K
        label?: string;
    }) {
        const route = new RouteHierarchy({
            key: props.key,
            label: props.label,
            parent: this,
        });

        return route;
    }
}




const baseRouterGroup = new RouteHierarchy({});

// frontpage
const frontpageRoute = baseRouterGroup.registerRoute({
    key: routeKeys.FRONTPAGE,
    label: "Frontpage",
});

// orders
const __ordersRoute = baseRouterGroup.registerRoute({
    label: "Orders",
});
const listOrdersRoute = __ordersRoute.registerRoute({
    key: routeKeys.LIST_ORDERS,
});
const createOrderRoute = __ordersRoute.registerRoute({
    key: routeKeys.CREATE_ORDER,
    label: "Create",
});

const __ordersIdRoute = __ordersRoute.registerRoute({
    label: "$id",
});
const manageOrderRoute = __ordersIdRoute.registerRoute({
    key: routeKeys.MANAGE_ORDER,
    label: "Manage",
});

// products
const __productsRoute = baseRouterGroup.registerRoute({
    label: "Products",
});
const listProductsRoute = __productsRoute.registerRoute({
    key: routeKeys.LIST_PRODUCTS,
});
const createProductRoute = __productsRoute.registerRoute({
    key: routeKeys.CREATE_PRODUCT,
    label: "Create",
});

const __productIdRoute = __productsRoute.registerRoute({
    label: "$id",
});
const updateProductRoute = __productIdRoute.registerRoute({
    key: routeKeys.UPDATE_PRODUCT,
    label: "Update",
});

// product histories
const __productHistoriesRoute = baseRouterGroup.registerRoute({
    label: "Product Histories",
});
const listProductHistoriesRoute = __productHistoriesRoute.registerRoute({
    key: routeKeys.LIST_PRODUCT_HISTORIES,
});

// error pages
const loaderErrorRoute = baseRouterGroup.registerRoute({
    key: routeKeys.LOADER_ERROR,
});
const unkownErrorRoute = baseRouterGroup.registerRoute({
    key: routeKeys.UNKNOWN_ERROR,
});
const notFoundErrorRoute = baseRouterGroup.registerRoute({
    key: routeKeys.NOT_FOUND_ERROR,
});
const internalServerErrorRoute = baseRouterGroup.registerRoute({
    key: routeKeys.INTERNAL_SERVER_ERROR,
});
const clientSideErrorRoute = baseRouterGroup.registerRoute({
    key: routeKeys.CLIENT_SIDE_ERROR,
});


export default ROUTE_DATA;
