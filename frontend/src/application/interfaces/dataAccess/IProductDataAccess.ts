import ICreateProductRequestDTO from "../../contracts/products/create/ICreateProductRequestDTO";
import IListProductsRequestDTO from "../../contracts/products/list/IListProductsRequestDTO";
import IReadProductRequestDTO from "../../contracts/products/read/IReadProductRequestDTO";
import IUpdateProductRequestDTO from "../../contracts/products/update/IUpdateProductRequestDTO";
import IDeleteProductRequestDTO from "../../contracts/products/delete/IDeleteProductRequestDTO";

export default interface IProductDataAccess {
    listProducts(request: IListProductsRequestDTO): Promise<Response>;
    createProduct(request: ICreateProductRequestDTO): Promise<Response>;
    readProduct(request: IReadProductRequestDTO): Promise<Response>;
    updateProduct(request: IUpdateProductRequestDTO): Promise<Response>;
    deleteProduct(request: IDeleteProductRequestDTO): Promise<Response>;
}
