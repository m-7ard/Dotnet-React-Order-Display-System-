import { useRouterState } from "@tanstack/react-router";
import router from "../deps/router";

type RouterState = ReturnType<typeof useRouterState<typeof router>>;

type TanstackRouterState = RouterState & {
    location: {
        state: {
            error?: Error 
        }
    }
};

export default TanstackRouterState;