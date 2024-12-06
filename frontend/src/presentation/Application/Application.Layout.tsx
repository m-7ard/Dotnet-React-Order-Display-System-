import { Outlet } from "@tanstack/react-router";
import ApplicationExceptionNotice from "./Application.ExceptionNotice";
import ApplicationHeader from "./Application.Header";
import ApplicationProvider from "./Application.Provider";

export default function ApplicationLayout() {    
    return (
        <ApplicationProvider>
            <main
                className="flex flex-col bg-gray-50 h-full w-full  mx-auto  overflow-hidden  border-x  border-gray-900 text-gray-900"
            >
                <ApplicationExceptionNotice />
                <ApplicationHeader/>
                <Outlet />
            </main>
        </ApplicationProvider>
    );
}
