import { err, ok } from "neverthrow";
import IListProductsRequestDTO from "../../infrastructure/contracts/products/list/IListProductsRequestDTO";
import ICreateProductRequestDTO from "../../infrastructure/contracts/products/create/ICreateProductRequestDTO";
import { getApiUrl } from "../../viteUtils";
import IExceptionService from "../Interfaces/IExceptionService";

export default class ProductDataAccess {
    private readonly _apiRoute = `${getApiUrl()}/api/products`;

    /*

    private readonly _exceptionService: IExceptionService;

    constructor(props: { exceptionService: IExceptionService }) {
        this._exceptionService = props.exceptionService;
    }

    */

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
}
