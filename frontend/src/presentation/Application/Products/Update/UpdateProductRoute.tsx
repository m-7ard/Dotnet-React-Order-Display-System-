import { Navigate, useLoaderData, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import UpdateProductPage from "./UpdateProductPage";
import { useQuery } from "@tanstack/react-query";

export default function UpdateProductRoute() {
    const { id } = useParams({ from: "/products/$id/update" });
    const { ok, data } = useLoaderData({ from: "/products/$id/update" });
    const { dispatchException } = useApplicationExceptionContext();

    const productQuery = useQuery({
        queryKey: ["product", parseInt(id)],
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
        return <Navigate to="/products" />;
    }

    if (productQuery.data == null) {
        return;
    }

    const product = productQuery.data;
    return <UpdateProductPage product={product} />;
}
