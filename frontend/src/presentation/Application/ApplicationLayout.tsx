import { Link, Outlet } from "@tanstack/react-router";
import ApplicationProvider from "./ApplicationProvider";
import { useApplicationExceptionContext } from "../contexts/ApplicationExceptionHandlerContext";

function ApplicationHeader() {
    return (
        <header className="py-2 px-4 flex flex-row gap-x-2 bg-gray-100 items-center border-b border-gray-400">
            <Link to="/" className="text-blue-600 font-bold">
                ☰
            </Link>
        </header>
    );
}

function ApplicationExceptionNotice() {
    const { exception, dismissException } = useApplicationExceptionContext();
    if (exception == null) return null;
    return (
        <div className="fixed mx-auto top-4 left-4 right-4 flex flex-col bg-red-400 border border-gray-400 shadow p-4 gap-4 text-gray-100 max-w-96" style={{ zIndex: 1000000 }}>
            <div className="flex flex-row gap-4 justify-between items-center">
                <div className="text-sm">
                    {exception.message}
                </div>
                <div className="mixin-button-like" onClick={dismissException}>
                    ✖
                </div>
            </div>
        </div>
    ) 
}

export default function ApplicationLayout() {
    return (
        <ApplicationProvider>
            <main
                className="
                    flex
                    flex-col
                    bg-gray-50 
                    h-full
                    w-full 
                    max-w-80 
                    mx-auto 
                    overflow-hidden 
                    border-x 
                    border-gray-400
                    text-gray-900"
            >
                <ApplicationExceptionNotice />
                <ApplicationHeader />
                <Outlet />
            </main>
        </ApplicationProvider>
    );
}
