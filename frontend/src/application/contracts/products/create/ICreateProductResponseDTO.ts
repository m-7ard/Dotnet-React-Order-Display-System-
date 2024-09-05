import { Result } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import IPlainApiError from "../../../interfaces/IPlainApiError";

type ICreateProductRespnseDTO = Result<{
    product: IProduct;
}, IPlainApiError>

export default ICreateProductRespnseDTO;