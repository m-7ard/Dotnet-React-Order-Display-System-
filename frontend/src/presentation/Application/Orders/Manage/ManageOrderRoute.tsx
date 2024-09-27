import { Navigate, useLoaderData, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import { useQuery } from "@tanstack/react-query";
import ManageOrderPage from "./ManageOrderPage";

export default function ManageOrderRoute() {
    const { id } = useParams({ from: "/orders/$id/manage" });
    const { ok, data } = useLoaderData({ from: "/orders/$id/manage" });
    const { dispatchException } = useApplicationExceptionContext();

    const orderQuery = useQuery({
        queryKey: ["order", parseInt(id)],
        queryFn: () => (ok ? data : null),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        gcTime: 0,
    });

    useEffect(() => {
        if (!ok) {
            dispatchException(data);
        }
    }, [ok, dispatchException, data]);

    if (!ok) {
        return <Navigate to="/orders" />;
    }

    if (orderQuery.data == null) {
        return;
    }

    const order = orderQuery.data;
    return <ManageOrderPage order={order} />;
}
