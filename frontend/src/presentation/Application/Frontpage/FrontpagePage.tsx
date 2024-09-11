import { Link } from "@tanstack/react-router";

export default function FrontpagePage() {
    return (
        <div className="px-4 py-4 flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
                <Link
                    to={"/products"}
                    className="mixin-button-like mixin-button-base theme-button-generic-white justify-between"
                >
                    <span>Products</span>
                    <span>↪</span>
                </Link>
                <Link
                    to={"/orders"}
                    className="mixin-button-like mixin-button-base theme-button-generic-white justify-between"
                >
                    <span>Orders</span>
                    <span>↪</span>
                </Link>
            </div>
        </div>
    );
}
