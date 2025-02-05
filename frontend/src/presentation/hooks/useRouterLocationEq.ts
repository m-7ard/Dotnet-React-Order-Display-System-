import { useLocation } from "@tanstack/react-router";
import { IGenericRoutes, genericRoutes, TAnyGenericRoute } from "../routes/Route";

function useRouterLocationEq() {
    const location = useLocation();

    return <T extends TAnyGenericRoute>(exp: (keys: IGenericRoutes) => T) => {
        const route = exp(genericRoutes);

        return location.pathname === route.config?.pattern;
    };
}

export default useRouterLocationEq;
