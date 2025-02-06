import IProduct from "../../domain/models/IProduct";
import ProductHistory from "../../domain/models/IProductHistory";
import Order from "../../domain/models/Order";

/* eslint-disable @typescript-eslint/no-explicit-any */
type IRouteParams = Record<string, string>;

export interface IRouteConfig<Params extends IRouteParams> {
    build: (props: Params) => string;
    pattern: string;
}

export interface IManageOrderParams extends IRouteParams {
    id: string;
}
export interface IUpdateProductParams extends IRouteParams {
    id: string;
}
export type IEmptyParams = IRouteParams;

type EmptyLoaderData = never;
export type ErrorPageLoaderData = { error: Error };

export type ListOrdersLoaderData = { orders: Order[] };
export type ManageOrderLoaderData = { order: Order };

export type ListProductsLoaderData = { products: IProduct[] };
export type UpdateProductLoaderData = { product: IProduct };

export type ListProductHistoriesLoaderData = { productHistories: ProductHistory[] };

interface ConfigInterface {
    FRONTPAGE: IRouteConfig<IEmptyParams>;

    LIST_ORDERS: IRouteConfig<IEmptyParams>;
    CREATE_ORDER: IRouteConfig<IEmptyParams>;
    MANAGE_ORDERS: IRouteConfig<IManageOrderParams>;

    LIST_PRODUCTS: IRouteConfig<IEmptyParams>;
    CREATE_PRODUCT: IRouteConfig<IEmptyParams>;
    UPDATE_PRODUCT: IRouteConfig<IUpdateProductParams>;

    LIST_PRODUCT_HISTORIES: IRouteConfig<IEmptyParams>;

    LOADER_ERROR: IRouteConfig<IEmptyParams>;
    UNKNOWN_ERROR: IRouteConfig<IEmptyParams>;
    NOT_FOUND_ERROR: IRouteConfig<IEmptyParams>;
    INTERNAL_SERVER_ERROR: IRouteConfig<IEmptyParams>;
    CLIENT_SIDE_ERROR: IRouteConfig<IEmptyParams>;
    CRASH_ERROR: IRouteConfig<IEmptyParams>;
}

/*
type RoutePatterns = "/" | "/orders" | "/orders/create" | "/orders/$id/manage" | 
                     "/products" | "/products/create" | "/products/$id/update" | "";

type WithLiteralPattern<T extends IRouteConfig<any>> = Omit<T, 'pattern'> & {
    pattern: RoutePatterns;
};

type TanstackConfigInterface = {
    [K in keyof ConfigInterface]: WithLiteralPattern<ConfigInterface[K]>
};
*/

export const tanstackConfigs: ConfigInterface = {
    FRONTPAGE: {
        build: () => "/",
        pattern: "/",
    },

    LIST_ORDERS: {
        pattern: "/orders",
        build: () => "/orders",
    },
    CREATE_ORDER: {
        pattern: "/orders/create",
        build: () => "/orders/create",
    },
    MANAGE_ORDERS: {
        pattern: "/orders/$id/manage",
        build: ({ id }) => `/order/${id}/manage`,
    },

    LIST_PRODUCTS: {
        pattern: "/products",
        build: () => "/products",
    },
    CREATE_PRODUCT: {
        pattern: "/products/create",
        build: () => "/products/create",
    },
    UPDATE_PRODUCT: {
        pattern: "/products/$id/update",
        build: ({ id }) => `/products/${id}/update`,
    },

    LIST_PRODUCT_HISTORIES: {
        pattern: "/product_histories",
        build: () => "/product_histories",
    },

    LOADER_ERROR: {
        pattern: "/errors/loader",
        build: () => "/errors/loader",
    },
    UNKNOWN_ERROR: {
        pattern: "/errors/unknown",
        build: () => "/errors/unknown",
    },
    NOT_FOUND_ERROR: {
        pattern: "/errors/not_found",
        build: () => "/errors/not_found",
    },
    INTERNAL_SERVER_ERROR: {
        pattern: "/errors/internal_server_error",
        build: () => "/errors/internal_server_error",
    },
    CLIENT_SIDE_ERROR: {
        pattern: "/errors/client_side",
        build: () => "/errors/client_side",
    },
    CRASH_ERROR: {
        pattern: "/errors/crash",
        build: () => "/errors/crash",
    }
};

export type IGenericRoute<Config extends IRouteConfig<any>, LoaderData> = {
    __loaderDataType?: LoaderData;

    parent: null | IGenericRoute<any, any>;
    label: string | null;
    isLayout: boolean;
    config?: Config;
};
export type TAnyGenericRoute = IGenericRoute<IRouteConfig<any>, any>;
export type TExtractGenericRouteParams<T> = T extends IGenericRoute<IRouteConfig<infer Params>, any> ? Params : never;
export type TExtractGenericRouteLoaderData<T> = T extends IGenericRoute<IRouteConfig<any>, infer LoaderData> ? NonNullable<LoaderData> : never;

export function isLayoutRoute<T extends TAnyGenericRoute>(route: T): route is T & { isLayout: true; config: undefined } {
    return route.isLayout === true && route.config === undefined;
}

export interface IGenericRoutes {
    FRONTPAGE: IGenericRoute<IRouteConfig<IEmptyParams>, EmptyLoaderData>;

    LIST_ORDERS: IGenericRoute<IRouteConfig<IEmptyParams>, { orders: Order[] }>;
    CREATE_ORDER: IGenericRoute<IRouteConfig<IEmptyParams>, EmptyLoaderData>;
    MANAGE_ORDER: IGenericRoute<IRouteConfig<IManageOrderParams>, { order: Order }>;

    LIST_PRODUCTS: IGenericRoute<IRouteConfig<IEmptyParams>, { products: IProduct[] }>;
    CREATE_PRODUCT: IGenericRoute<IRouteConfig<IEmptyParams>, EmptyLoaderData>;
    UPDATE_PRODUCT: IGenericRoute<IRouteConfig<IUpdateProductParams>, { product: IProduct }>;

    LIST_PRODUCT_HISTORIES: IGenericRoute<IRouteConfig<IEmptyParams>, { productHistories: ProductHistory[] }>;

    LOADER_ERROR: IGenericRoute<IRouteConfig<IEmptyParams>, ErrorPageLoaderData>;
    UNKNOWN_ERROR: IGenericRoute<IRouteConfig<IEmptyParams>, ErrorPageLoaderData>;
    NOT_FOUND_ERROR: IGenericRoute<IRouteConfig<IEmptyParams>, ErrorPageLoaderData>;
    INTERNAL_SERVER_ERROR: IGenericRoute<IRouteConfig<IEmptyParams>, ErrorPageLoaderData>;
    CLIENT_SIDE_ERROR: IGenericRoute<IRouteConfig<IEmptyParams>, ErrorPageLoaderData>;
}

const frontpage: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: null,
    config: tanstackConfigs.FRONTPAGE,
    label: "All",
    isLayout: false,
};

// orders

const listOrders: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: frontpage,
    config: tanstackConfigs.LIST_ORDERS,
    label: "Orders",
    isLayout: false,
};

const createOrder: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: listOrders,
    config: tanstackConfigs.CREATE_ORDER,
    label: "Create",
    isLayout: false,
};

const __orderIdLayout__: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: listOrders,
    label: ":id",
    isLayout: true,
};

const manageOrder: IGenericRoute<IRouteConfig<IManageOrderParams>, never> = {
    parent: __orderIdLayout__,
    config: tanstackConfigs.MANAGE_ORDERS,
    label: "Manage",
    isLayout: false,
};

// products

const listProducts: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: frontpage,
    config: tanstackConfigs.LIST_PRODUCTS,
    label: "Products",
    isLayout: false,
};

const createProduct: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: listProducts,
    config: tanstackConfigs.CREATE_PRODUCT,
    label: "Create",
    isLayout: false,
};

const updateProduct: IGenericRoute<IRouteConfig<IUpdateProductParams>, never> = {
    parent: listProducts,
    config: tanstackConfigs.CREATE_PRODUCT,
    label: "Create",
    isLayout: false,
};

// Product histories
const listProductHistories: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: frontpage,
    config: tanstackConfigs.LIST_PRODUCT_HISTORIES,
    label: "Product Histories",
    isLayout: false,
};

// errors
const __errorsLayout__: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: frontpage,
    label: "Errors",
    isLayout: true,
};

const loaderError: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.LOADER_ERROR,
    label: "Loader",
    isLayout: false,
};
const unknownError: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.UNKNOWN_ERROR,
    label: "Unknown",
    isLayout: false,
};
const notFoundError: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.NOT_FOUND_ERROR,
    label: "Not Found",
    isLayout: false,
};
const internalServerError: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.INTERNAL_SERVER_ERROR,
    label: "Internal Server Error",
    isLayout: false,
};
const clientSideError: IGenericRoute<IRouteConfig<IEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.CLIENT_SIDE_ERROR,
    label: "Client Side Error",
    isLayout: false,
};

export const genericRoutes: IGenericRoutes = {
    FRONTPAGE: frontpage,

    LIST_ORDERS: listOrders,
    CREATE_ORDER: createOrder,
    MANAGE_ORDER: manageOrder,

    LIST_PRODUCTS: listProducts,
    CREATE_PRODUCT: createProduct,
    UPDATE_PRODUCT: updateProduct,

    LIST_PRODUCT_HISTORIES: listProductHistories,

    LOADER_ERROR: loaderError,
    UNKNOWN_ERROR: unknownError,
    NOT_FOUND_ERROR: notFoundError,
    INTERNAL_SERVER_ERROR: internalServerError,
    CLIENT_SIDE_ERROR: clientSideError,
};
