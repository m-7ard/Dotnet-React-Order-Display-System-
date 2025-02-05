import { redirect } from "@tanstack/react-router";
import tryHandleRequest from "./routableErrors/tryHandleRequest";
import handleInvalidResponse from "./routableErrors/handleInvalidResponse";

class TanstackRouterUtils {
    static async handleRequest(promise: Promise<Response>): Promise<Response> {
        const result = await tryHandleRequest(promise);

        if (result.isErr()) {
            throw redirect({ to: result.error.route.config?.pattern, state: (prev) => ({ ...prev, error: result.error }) });
        }

        return result.value;
    }

    static async handleInvalidResponse(response: Response): Promise<void> {
        const error = await handleInvalidResponse(response);
        throw redirect({ to: error.route.config?.pattern, state: (prev) => ({ ...prev, error: error }) });
    }
}

export default TanstackRouterUtils;
