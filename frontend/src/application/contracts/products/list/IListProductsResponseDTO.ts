import { Result } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import IPlainApiError from "../../../interfaces/IPlainApiError";

type IListProductsResponseDTO = Result<{
    products: IProduct[];
}, IPlainApiError>

export default IListProductsResponseDTO; 