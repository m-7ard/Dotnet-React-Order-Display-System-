import { err, ok, Result } from "neverthrow";
import IListProductsRequestDTO from "../../application/contracts/products/list/IListProductsRequestDTO";
import IListProductsResponseDTO from "../../application/contracts/products/list/IListProductsResponseDTO";
import IProductDataAccess from "../../application/interfaces/dataAccess/IProductAccess";
import ICreateProductRequestDTO from "../../application/contracts/products/create/ICreateProductRequestDTO";
import ICreateProductRespnseDTO from "../../application/contracts/products/create/ICreateProductResponseDTO";
import IUploadProductImagesRequestDTO from "../../application/contracts/products/uploadImages/IUploadProductImagesRequestDTO";
import IUploadProductImagesResponseDTO from "../../application/contracts/products/uploadImages/IUploadProductImagesResponseDTO";
import handleResponse from "../utils/handleResponse";
import IPlainApiError from "../../application/interfaces/IPlainApiError";
import IProduct from "../../domain/models/IProduct";
import productMapper from "../mappers/productMapper";
import IReadProductRequestDTO from "../../application/contracts/products/read/IReadProductRequestDTO";
import IReadProductResponseDTO from "../../application/contracts/products/read/IReadProductResponseDTO";
import IUpdateProductRequestDTO from "../../application/contracts/products/update/IUpdateProductRequestDTO";
import IUpdateProductRespnseDTO from "../../application/contracts/products/update/IUpdateProductRespnseDTO";
import IDeleteProductRequestDTO from "../../application/contracts/products/delete/IDeleteProductRequestDTO";
import IDeleteProductRespnseDTO from "../../application/contracts/products/delete/IDeleteProductRespnseDTO";

export default class ProductDataAccess implements IProductDataAccess {
    private readonly _apiRoute = "http://localhost:5102/api/products";
    
    async listProducts(request: IListProductsRequestDTO): Promise<Result<IProduct[], IPlainApiError>> {
        const urlParams = new URLSearchParams();
        Object.entries(request).forEach(([ name, value ]) => value != null && urlParams.append(name, value));
        const response = await fetch(`${this._apiRoute}/list?${urlParams}`, {
            method: "GET"
        });

        const { isOk, data } = await handleResponse<IListProductsResponseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        return isOk ? ok(data.products.map(productMapper.apiToDomain)) : err(data);
    }

    async createProduct(request: ICreateProductRequestDTO): Promise<Result<IProduct, IPlainApiError>> {
        const response = await fetch(`${this._apiRoute}/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });

        const { isOk, data } = await handleResponse<ICreateProductRespnseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        return isOk ? ok(productMapper.apiToDomain(data.product)) : err(data);
    }

    async uploadImages(request: IUploadProductImagesRequestDTO): Promise<Result<string[], IPlainApiError>> {
        const formData = new FormData();
        request.files.forEach((file) => formData.append("Files", file));
        
        const response = await fetch(`${this._apiRoute}/upload_images`, {
            method: "POST",
            body: formData
        });

        const { isOk, data } = await handleResponse<IUploadProductImagesResponseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        return isOk ? ok(data.images) : err(data);
    }

    async readProduct(request: IReadProductRequestDTO): Promise<Result<IProduct, IPlainApiError>> {
        const response = await fetch(`${this._apiRoute}/${request.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },        
        });

        const { isOk, data } = await handleResponse<IReadProductResponseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        return isOk ? ok(productMapper.apiToDomain(data.product)) : err(data);
    }

    async updateProduct(request: IUpdateProductRequestDTO): Promise<Result<IProduct, IPlainApiError>> {
        const response = await fetch(`${this._apiRoute}/${request.id}/update`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });

        const { isOk, data } = await handleResponse<IUpdateProductRespnseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        return isOk ? ok(productMapper.apiToDomain(data.product)) : err(data);
    }

    async deleteProduct(request: IDeleteProductRequestDTO): Promise<Result<null, IPlainApiError>> {
        const response = await fetch(`${this._apiRoute}/${request.id}/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });

        const { isOk, data } = await handleResponse<IDeleteProductRespnseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        return isOk ? ok(null) : err(data);    
    }
}