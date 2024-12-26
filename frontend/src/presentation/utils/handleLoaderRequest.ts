import { redirect } from "@tanstack/react-router";
import LoaderErrorException from "../routableException/LoaderErrorException";

export default async function handleLoaderRequest(promise: Promise<Response>) {
    try {
        try {
            const response = await promise;
            return response;
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new LoaderErrorException(err.message);
            } else {
                throw err;
            }
        }
    } catch (err: unknown) {
        if (err instanceof LoaderErrorException) {
            throw redirect({ to: err.route, state: (prev) => ({ ...prev, error: err }) });
        }

        throw redirect({ to: "/unknown_error", state: (prev) => ({ ...prev, error: err }) });
    }
}
