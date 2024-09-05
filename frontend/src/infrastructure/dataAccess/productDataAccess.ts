import { err, ok } from "neverthrow";
import IListProductsRequestDTO from "../../application/contracts/products/list/IListProductsRequestDTO";
import IListProductsResponseDTO from "../../application/contracts/products/list/IListProductsResponseDTO";
import InternalServerError from "../../application/errors/InternalServerError";
import IProductDataAccess from "../../application/interfaces/dataAccess/IProductAccess";
import ICreateProductRequestDTO from "../../application/contracts/products/create/ICreateProductRequestDTO";
import ICreateProductRespnseDTO from "../../application/contracts/products/create/ICreateProductResponseDTO";
import IUploadProductImagesRequestDTO from "../../application/contracts/products/uploadImages/IUploadProductImagesRequestDTO";
import IUploadProductImagesResponseDTO from "../../application/contracts/products/uploadImages/IUploadProductImagesResponseDTO";

export default class ProductDataAccess implements IProductDataAccess {
    private readonly _apiRoute = "http://localhost:5102/api/products";
    
    async listProducts(request: IListProductsRequestDTO): Promise<IListProductsResponseDTO> {
        const urlParams = new URLSearchParams();
        Object.entries(request).forEach(([ name, value ]) => value != null && urlParams.append(name, value));
        const response = await fetch(`${this._apiRoute}/list?${urlParams}`, {
            method: "GET"
        });

        if (response.status === 500) {
            throw new InternalServerError();
        }

        console.log('test');
        const content = await response.json();
        return response.ok ? ok(content) : err(content);
    }

    async createProduct(request: ICreateProductRequestDTO): Promise<ICreateProductRespnseDTO> {
        const response = await fetch(`${this._apiRoute}/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });

        if (response.status === 500) {
            throw new InternalServerError();
        }

        const content = await response.json();
        return response.ok ? ok(content) : err(content);
    }

    async uploadImages(request: IUploadProductImagesRequestDTO): Promise<IUploadProductImagesResponseDTO> {
        const formData = new FormData();
        request.files.forEach((file) => formData.append("Files", file));
        
        const response = await fetch(`${this._apiRoute}/upload_images`, {
            method: "POST",
            body: formData
        });

        if (response.status === 500) {
            throw new InternalServerError();
        }

        const content = await response.json();
        return response.ok ? ok(content) : err(content);
    }
}