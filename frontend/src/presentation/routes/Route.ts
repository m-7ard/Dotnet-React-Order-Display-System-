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

export interface IRouteConfigMapping {
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

export type ICommonRoute<Config extends IRouteConfig<any>, LoaderData> = {
    __loaderDataType?: LoaderData;

    parent: null | ICommonRoute<any, any>;
    label: string | null;
    isLayout: boolean;
    config?: Config;
};
export type TAnyGenericRoute = ICommonRoute<IRouteConfig<any>, any>;
export type TExtractGenericRouteParams<T> = T extends ICommonRoute<IRouteConfig<infer Params>, any> ? Params : never;
export type TExtractGenericRouteLoaderData<T> = T extends ICommonRoute<IRouteConfig<any>, infer LoaderData> ? NonNullable<LoaderData> : never;

export function isLayoutRoute<T extends TAnyGenericRoute>(route: T): route is T & { isLayout: true; config: undefined } {
    return route.isLayout === true && route.config === undefined;
}

export interface ICommonRouteMapping {
    FRONTPAGE: ICommonRoute<IRouteConfig<IEmptyParams>, EmptyLoaderData>;

    LIST_ORDERS: ICommonRoute<IRouteConfig<IEmptyParams>, { orders: Order[] }>;
    CREATE_ORDER: ICommonRoute<IRouteConfig<IEmptyParams>, EmptyLoaderData>;
    MANAGE_ORDER: ICommonRoute<IRouteConfig<IManageOrderParams>, { order: Order }>;

    LIST_PRODUCTS: ICommonRoute<IRouteConfig<IEmptyParams>, { products: IProduct[] }>;
    CREATE_PRODUCT: ICommonRoute<IRouteConfig<IEmptyParams>, EmptyLoaderData>;
    UPDATE_PRODUCT: ICommonRoute<IRouteConfig<IUpdateProductParams>, { product: IProduct }>;

    LIST_PRODUCT_HISTORIES: ICommonRoute<IRouteConfig<IEmptyParams>, { productHistories: ProductHistory[] }>;

    LOADER_ERROR: ICommonRoute<IRouteConfig<IEmptyParams>, ErrorPageLoaderData>;
    UNKNOWN_ERROR: ICommonRoute<IRouteConfig<IEmptyParams>, ErrorPageLoaderData>;
    NOT_FOUND_ERROR: ICommonRoute<IRouteConfig<IEmptyParams>, ErrorPageLoaderData>;
    INTERNAL_SERVER_ERROR: ICommonRoute<IRouteConfig<IEmptyParams>, ErrorPageLoaderData>;
    CLIENT_SIDE_ERROR: ICommonRoute<IRouteConfig<IEmptyParams>, ErrorPageLoaderData>;
}
