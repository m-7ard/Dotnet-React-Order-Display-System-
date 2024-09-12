type ILoaderResult<TOk, TError> =
    | {
          ok: true;
          data: TOk;
      }
    | {
          ok: false;
          data: TError;
      };

export default ILoaderResult;
