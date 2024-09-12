import { Navigate, useLoaderData } from "@tanstack/react-router";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import CoverImage from "../../../components/Resuables/CoverImage";
import MixinButton from "../../../components/Resuables/MixinButton";

export default function ManageOrderPage() {
    const { ok, data } = useLoaderData({ from: "/orders/$id/manage" });
    const { dispatchException } = useApplicationExceptionContext();

    useEffect(() => {
        if (!ok) {
            dispatchException(data);
        }
    }, [ok, dispatchException, data]);

    if (!ok) {
        return <Navigate to="/orders" />;
    }

    const order = data;

    return (
        <div className="mixin-page-like mixin-page-base">
            <header className="text-2xl text-gray-900 font-bold">Manage Order</header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <div className="bg-white divide-y divide-gray-300 rounded shadow border-gray-300 border">
                <div className="p-2 px-4 flex flex-col gap-2">
                    <div className="flex flex-row justify-between items-baseline">
                        <div className="text-base font-bold">Order #{order.id}</div>
                        <div className="text-sm">{`${order.status.value}`}</div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <MixinButton
                            className={`basis-1/2 justify-center rounded shadow ${order.orderItems.every((orderItem) => orderItem.status === "Finished") ? "" : "contrast-75 cursor-not-allowed"}`}
                            options={{ size: "mixin-button-sm", theme: "theme-button-generic-green" }}
                        >
                            Mark Finished
                        </MixinButton>
                        <MixinButton
                            className="basis-1/2 justify-center rounded shadow"
                            options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                        >
                            Other Options
                        </MixinButton>
                    </div>
                </div>
                {order.orderItems.map((orderItem) => (
                    <div className="flex flex-col gap-2 p-2 px-4">
                        <div className="w-full grid grid-cols-4 grid-rows-1 shrink-0 gap-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <CoverImage
                                    className="row-span-1 col-span-1 aspect-square border border-gray-300 rounded shadow overflow-hidden"
                                    src={
                                        orderItem.productHistory.images[i] == null
                                            ? undefined
                                            : `${import.meta.env.VITE_API_URL}/Media/${orderItem.productHistory.images[i]}`
                                    }
                                />
                            ))}
                        </div>
                        <div className="flex flex-col gap-1 grow">
                            <div>
                                <div className="text-sm font-semibold">Order Item #{orderItem.id}</div>
                                <div className="text-sm">{`${orderItem.status}`}</div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center text-sm">
                            <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow">
                                x{orderItem.quantity}
                            </div>{" "}
                            <div>{`${orderItem.productHistory.name}`}</div>
                        </div>
                        <div className="flex flex-row gap-1 mt-auto">
                            <MixinButton
                                className="basis-1/2 justify-center rounded shadow"
                                options={{ size: "mixin-button-sm", theme: "theme-button-generic-green" }}
                            >
                                Mark Finished
                            </MixinButton>
                            <MixinButton
                                className="basis-1/2 justify-center rounded shadow"
                                options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                            >
                                Other Options
                            </MixinButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
