import ICreateProductRequestDTO from "../../../infrastructure/contracts/products/create/ICreateProductRequestDTO";
import IListProductsRequestDTO from "../../../infrastructure/contracts/products/list/IListProductsRequestDTO";
import IReadProductRequestDTO from "../../../infrastructure/contracts/products/read/IReadProductRequestDTO";
import IUpdateProductRequestDTO from "../../../infrastructure/contracts/products/update/IUpdateProductRequestDTO";
import IDeleteProductRequestDTO from "../../../infrastructure/contracts/products/delete/IDeleteProductRequestDTO";

export default interface IProductDataAccess {
    listProducts(request: IListProductsRequestDTO): Promise<Response>;
    createProduct(request: ICreateProductRequestDTO): Promise<Response>;
    readProduct(request: IReadProductRequestDTO): Promise<Response>;
    updateProduct(request: IUpdateProductRequestDTO): Promise<Response>;
    deleteProduct(request: IDeleteProductRequestDTO): Promise<Response>;
}