import InternalServerError from "../../application/errors/InternalServerError";

type TypedResponse<TOk, TError> =
    | {
          isOk: true;
          data: TOk;
      }
    | {
          isOk: false;
          data: TError;
      };

export default async function handleResponse<TOk, TError>(props: {
    response: Response;
    onOk: (response: Response) => Promise<TOk>;
    onError: (response: Response) => Promise<TError>;
}): Promise<TypedResponse<TOk, TError>> {
    const { response, onOk, onError } = props;

    if (response.status === 500) {
        throw new InternalServerError();
    }

    if (response.ok) {
        return { isOk: true, data: await onOk(response) };
    }

    return { isOk: false, data: await onError(response) };
}
