import { useNavigate } from "@tanstack/react-router";
import { IGenericRoutes, genericRoutes, TExtractGenericRouteParams, TAnyGenericRoute } from "../routes/Route";

function useRouterNavigate() {
    const navigate = useNavigate();

    const navigateFn = <T extends TAnyGenericRoute>({ exp, params, search }: { exp: (keys: IGenericRoutes) => T; params: TExtractGenericRouteParams<T>; search?: Record<string, string> }) => {
        const route = exp(genericRoutes);

        if (route.config == null) {
            throw new Error("Navigate's route's config cannot be undefined or be a layout.");
        }

        navigate({ to: route.config!.pattern, params: params, search: search });
    };

    return navigateFn;
}

export default useRouterNavigate;
