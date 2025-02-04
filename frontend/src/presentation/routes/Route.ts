type TokenType<T> = T extends { __params: infer S } ? S : never;

type TokenMap = typeof DI_TOKENS;
type TokenKeys = keyof TokenMap;
type TokenValues = TokenMap[TokenKeys];

const makeToken = <Service>(literal: string) => literal as string & { __params: Service };

type BuilderFn<T extends Record<string, unknown> | unknown> = (params: T) => string

export const KEYS = {
    "FRONTPAGE": makeToken("FRONTPAGE"),
    "LIST_ORDERS": makeToken("LIST_ORDERS"),
    "MANAGE_ORDER": makeToken<{ id: string; }>("MANAGE_ORDER"),
} as const;


export abstract class AbstractRoute<Params extends Record<string, unknown> | undefined = undefined> {
    key?: keyof typeof KEYS;

    parent: AbstractRoute | null = null;
    constructor(public params: Params) {}
    public abstract build(): string;
    public abstract getLabel(): string;
}


const TANSTACK_KEY_MAPPING = {
    FRONTPAGE: () => "",
    LIST_ORDERS: () => "",
    MANAGE_ORDER: ({ id }) => id,
} as {
    [K in keyof typeof KEYS]: BuilderFn<TokenType<(typeof KEYS)[K]>>;
};