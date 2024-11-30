import { Outlet } from "@tanstack/react-router";
import Provider from "./Application.Provider";
import Exception from "./Application.Exception";

export default function Application() {
    return (
        <Provider>
            <header className="py-2 px-4 flex flex-row gap-2 bg-gray-50 items-center border-b border-gray-900">

            </header>
            <main
                className="flex flex-col bg-gray-50 h-full w-full  mx-auto  overflow-hidden  border-x  border-gray-900 text-gray-900"
            >
                <Exception />
                <Outlet />
            </main>
        </Provider>
    );
}
