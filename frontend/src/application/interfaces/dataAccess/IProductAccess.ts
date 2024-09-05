import ICreateProductRequestDTO from "../../contracts/products/create/ICreateProductRequestDTO";
import ICreateProductResponseDTO from "../../contracts/products/create/ICreateProductResponseDTO";
import IListProductsRequestDTO from "../../contracts/products/list/IListProductsRequestDTO";
import IListProductsResponseDTO from "../../contracts/products/list/IListProductsResponseDTO";
import IUploadProductImagesRequestDTO from "../../contracts/products/uploadImages/IUploadProductImagesRequestDTO";
import IUploadProductImagesResponseDTO from "../../contracts/products/uploadImages/IUploadProductImagesResponseDTO";

export default interface IProductDataAccess {
    listProducts(request: IListProductsRequestDTO): Promise<IListProductsResponseDTO>;
    createProduct(request: ICreateProductRequestDTO): Promise<ICreateProductResponseDTO>;
    uploadImages(request: IUploadProductImagesRequestDTO): Promise<IUploadProductImagesResponseDTO>;
}