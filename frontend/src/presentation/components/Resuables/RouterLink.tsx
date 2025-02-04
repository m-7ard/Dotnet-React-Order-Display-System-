import { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { genericRoutes, IGenericRoutes, TAnyGenericRoute, TExtractGenericRouteParams } from "../../routes/Route";
import useRouterNavigate from "../../hooks/useRouterNavigate";

export default function RouterLink<T extends TAnyGenericRoute>({
    children,
    exp,
    params,
    ...htmlAttrs
}: PropsWithChildren<{ exp: (keys: IGenericRoutes) => T; params: TExtractGenericRouteParams<T> } & AnchorHTMLAttributes<HTMLAnchorElement>>) {
    const navigate = useRouterNavigate();
    const route = exp(genericRoutes);

    if (route.config == null) {
        throw new Error("Navigate's route's config cannot be undefined or be a layout.");
    }

    const href = route.config.build(params);

    return (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();
                navigate({ exp, params });
            }}
            {...htmlAttrs}
        >
            {children}
        </a>
    );
}
