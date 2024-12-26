import { redirect } from "@tanstack/react-router";
import RoutableException from "../routableException/RoutableException";
import InternalServerErrorException from "../routableException/InternalServerErrorException";
import IPlainApiError from "../../infrastructure/interfaces/IPlainApiError";
import NotFoundException from "../routableException/NotFoundException";
import UnkownErrorException from "../routableException/UnkownErrorException";
import routeData from "../routes/_routeData";

async function tryGetError(response: Response) {
    try {
        const errors: IPlainApiError = await response.json();
        const errorMessage = errors.join(" ");
        return errorMessage;
    } catch (err: unknown) {
        return response.statusText;
    }
}

export default async function handleLoaderResponse(response: Response) {
    try {
        const errorMessage = await tryGetError(response);

        if (response.status === 500) {
            throw new InternalServerErrorException(errorMessage);
        }

        if (response.status === 404) {
            throw new NotFoundException(errorMessage);
        }

        throw new UnkownErrorException(errorMessage);
    } catch (err: unknown) {
        if (err instanceof RoutableException) {
            throw redirect({ to: err.route, state: (prev) => ({ ...prev, error: err }) });
        } else {
            throw redirect({ to: routeData.loaderError.pattern, state: (prev) => ({ ...prev, error: err }) });
        }
    }
}
