const createRouteKey = <BuilderArgs extends Record<string, string>, Value extends string>(value: Value) => value as TRouteKey<BuilderArgs, Value>;
export type TRouteKey<BuilderArgs extends Record<string, string>, Value extends string> = Value & { __builderArgs: BuilderArgs };
export type ExtractBuilderArgs<RouteKey extends keyof typeof routeKeys> = typeof routeKeys[RouteKey] extends TRouteKey<infer BuilderArgs, string> ? BuilderArgs : never;

const routeKeys = {
    FRONTPAGE: createRouteKey<{ deez: string }, "FRONTPAGE">("FRONTPAGE"),
    LIST_ORDERS: createRouteKey<{ record: string }, "LIST_ORDERS">("LIST_ORDERS"),
    CREATE_ORDER: createRouteKey<{ record: string }, "CREATE_ORDER">("CREATE_ORDER"),
    MANAGE_ORDER: createRouteKey<{ record: string }, "MANAGE_ORDER">("MANAGE_ORDER"),
    LIST_PRODUCTS: createRouteKey<{ record: string }, "LIST_PRODUCTS">("LIST_PRODUCTS"),
    CREATE_PRODUCT: createRouteKey<{ record: string }, "CREATE_PRODUCT">("CREATE_PRODUCT"),
    UPDATE_PRODUCT: createRouteKey<{ record: string }, "UPDATE_PRODUCT">("UPDATE_PRODUCT"),
    LIST_PRODUCT_HISTORIES: createRouteKey<{ record: string }, "LIST_PRODUCT_HISTORIES">("LIST_PRODUCT_HISTORIES"),
    LOADER_ERROR: createRouteKey<{ record: string }, "LOADER_ERROR">("LOADER_ERROR"),
    UNKNOWN_ERROR: createRouteKey<{ record: string }, "UNKNOWN_ERROR">("UNKNOWN_ERROR"),
    NOT_FOUND_ERROR: createRouteKey<{ record: string }, "NOT_FOUND_ERROR">("NOT_FOUND_ERROR"),
    INTERNAL_SERVER_ERROR: createRouteKey<{ record: string }, "INTERNAL_SERVER_ERROR">("INTERNAL_SERVER_ERROR"),
    CLIENT_SIDE_ERROR: createRouteKey<{ record: string }, "CLIENT_SIDE_ERROR">("CLIENT_SIDE_ERROR"),
} as const;

export default routeKeys;