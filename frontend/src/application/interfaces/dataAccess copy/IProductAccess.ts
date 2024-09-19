import { Result } from "neverthrow";
import ICreateProductRequestDTO from "../../contracts/products/create/ICreateProductRequestDTO";
import IListProductsRequestDTO from "../../contracts/products/list/IListProductsRequestDTO";
import IUploadDraftImagesRequestDTO from "../../contracts/draftImages/uploadImages/IUploadDraftImagesRequestDTO";
import IProduct from "../../../domain/models/IProduct";
import IPlainApiError from "../IPlainApiError";
import IReadProductRequestDTO from "../../contracts/products/read/IReadProductRequestDTO";
import IUpdateProductRequestDTO from "../../contracts/products/update/IUpdateProductRequestDTO";
import IDeleteProductRequestDTO from "../../contracts/products/delete/IDeleteProductRequestDTO";

export default interface IProductDataAccess {
    listProducts(request: IListProductsRequestDTO): Promise<Result<IProduct[], IPlainApiError>>;
    createProduct(request: ICreateProductRequestDTO): Promise<Result<IProduct, IPlainApiError>>;
    readProduct(request: IReadProductRequestDTO): Promise<Result<IProduct, IPlainApiError>>;
    updateProduct(request: IUpdateProductRequestDTO): Promise<Result<IProduct, IPlainApiError>>;
    deleteProduct(request: IDeleteProductRequestDTO): Promise<Result<null, IPlainApiError>>;
    uploadImages(request: IUploadDraftImagesRequestDTO): Promise<Result<string[], IPlainApiError>>;
}
