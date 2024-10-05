import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";

type IDeleteProductResult = Result<null, IApplicationErrors>;

export default IDeleteProductResult;
