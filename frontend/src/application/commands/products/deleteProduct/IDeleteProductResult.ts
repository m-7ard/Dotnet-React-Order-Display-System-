import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import IProduct from "../../../../domain/models/IProduct";

type IDeleteProductResult = Result<{
    product: IProduct;
}, IApplicationErrors>;

export default IDeleteProductResult;
