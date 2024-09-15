import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import IProduct from "../../../../domain/models/IProduct";

type IReadProductResult = Result<{
    product: IProduct;
}, IApplicationErrors>;

export default IReadProductResult;
