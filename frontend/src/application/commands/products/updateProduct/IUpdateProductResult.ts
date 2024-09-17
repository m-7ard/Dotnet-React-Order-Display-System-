import { Result } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";

type IUpdateProductResult = Result<{
    product: IProduct
}, IApplicationErrors>;

export default IUpdateProductResult;