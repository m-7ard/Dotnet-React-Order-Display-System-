import IListProductsRequestDTO from "../../application/contracts/products/list/IListProductsRequestDTO";
import IProductDataAccess from "../../application/interfaces/dataAccess/IProductDataAccess";
import ICreateProductRequestDTO from "../../application/contracts/products/create/ICreateProductRequestDTO";
import IReadProductRequestDTO from "../../application/contracts/products/read/IReadProductRequestDTO";
import IUpdateProductRequestDTO from "../../application/contracts/products/update/IUpdateProductRequestDTO";
import IDeleteProductRequestDTO from "../../application/contracts/products/delete/IDeleteProductRequestDTO";
import { getApiUrl } from "../../viteUtils";

export default class ProductDataAccess implements IProductDataAccess {
    private readonly _apiRoute = `${getApiUrl()}/api/products`;

    async listProducts(request: IListProductsRequestDTO): Promise<Response> {
        const urlParams = new URLSearchParams();
        Object.entries(request).forEach(([name, value]) => value != null && urlParams.append(name, value));
        const response = await fetch(`${this._apiRoute}/list?${urlParams}`, {
            method: "GET",
        });

        return response;
    }

    async createProduct(request: ICreateProductRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        return response;
    }

    async readProduct(request: IReadProductRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/${request.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response;
    }

    async updateProduct(request: IUpdateProductRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/${request.id}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        return response;
    }

    async deleteProduct(request: IDeleteProductRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/${request.id}/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        return response;
    }
}
