import { Result } from "neverthrow";
import UnknownError from "../errors/UnkownError";
import { useApplicationExceptionContext } from "../Application/Application.ExceptionProvider.Context";
import InternalServerError from "../errors/InternalServerError";
import { useCallback } from "react";

export default function useResponseHandler() {
    const { dispatchException } = useApplicationExceptionContext();

    return useCallback(async <S, E, F>(props: { requestFn: () => Promise<Response>; onResponseFn: (response: Response) => Promise<Result<S, E>>; fallbackValue?: F }) => {
        const { requestFn, onResponseFn, fallbackValue } = props;

        try {
            const response = await requestFn();
            if (response.status === 500) {
                dispatchException(new InternalServerError());
                return fallbackValue;
            }

            const result = await onResponseFn(response);
            if (result.isOk()) {
                return result.value;
            }

            dispatchException(new UnknownError({ message: "Way to handle response was not found." }));
            return result.error;
        } catch (err: unknown) {
            dispatchException(err);
            return fallbackValue;
        }
    }, [dispatchException]);
}
