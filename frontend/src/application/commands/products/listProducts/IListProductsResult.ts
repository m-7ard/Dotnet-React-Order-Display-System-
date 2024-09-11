import { Result } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";

type IListProductsResult = Result<{
    products: IProduct[] 
}, IApplicationErrors>;

export default IListProductsResult;
