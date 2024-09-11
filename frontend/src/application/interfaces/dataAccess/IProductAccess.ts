import { Result } from "neverthrow";
import ICreateProductRequestDTO from "../../contracts/products/create/ICreateProductRequestDTO";
import IListProductsRequestDTO from "../../contracts/products/list/IListProductsRequestDTO";
import IUploadProductImagesRequestDTO from "../../contracts/products/uploadImages/IUploadProductImagesRequestDTO";
import IProduct from "../../../domain/models/IProduct";
import IPlainApiError from "../IPlainApiError";

export default interface IProductDataAccess {
    listProducts(request: IListProductsRequestDTO): Promise<Result<IProduct[], IPlainApiError>>;
    createProduct(request: ICreateProductRequestDTO): Promise<Result<IProduct, IPlainApiError>>;
    uploadImages(request: IUploadProductImagesRequestDTO): Promise<Result<string[], IPlainApiError>>;
}
