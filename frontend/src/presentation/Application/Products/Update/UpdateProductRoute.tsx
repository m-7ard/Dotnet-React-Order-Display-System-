import { Navigate, useLoaderData } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import UpdateProductPage from "./UpdateProductPage";

export default function UpdateProductRoute() {
    const { ok, data } = useLoaderData({ from: "/products/$id/update" });
    const { dispatchException } = useApplicationExceptionContext();

    useEffect(() => {
        if (!ok) {
            dispatchException(data);
        }
    }, [ok, dispatchException, data]);
    
    if (!ok) {
        return <Navigate to="/products" />
    }

    return <UpdateProductPage 
        product={data}
    />
}
