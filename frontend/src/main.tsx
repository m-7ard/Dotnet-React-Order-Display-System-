import { createRoot } from "react-dom/client";
import "./presentation/css/index.scss";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import router from "./presentation/deps/router";
import queryClient from "./presentation/deps/queryClient";

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>,
);
