import { err, ok, Result } from "neverthrow";
import handleResponse from "../utils/handleResponse";
import IPlainApiError from "../../application/interfaces/IPlainApiError";
import IProductHistory from "../../domain/models/IProductHistory";
import productHistoryMapper from "../mappers/productHistoryMapper";
import IProductHistoryDataAccess from "../../application/interfaces/dataAccess/IProductHistoryDataAccess";
import IListProductHistoriesRequestDTO from "../../application/contracts/productHistories/list/IListProductHistoriesRequestDTO";
import IListProductHistoriesResponseDTO from "../../application/contracts/productHistories/list/IListProductsResponseDTO";
import { getApiUrl } from "../../viteUtils";

export default class ProductHistoryDataAccess implements IProductHistoryDataAccess {
    private readonly _apiRoute = `${getApiUrl()}/api/product_histories`;
    
    async listProductHistories(request: IListProductHistoriesRequestDTO): Promise<Result<IProductHistory[], IPlainApiError>> {
        const urlParams = new URLSearchParams();
        Object.entries(request).forEach(([ name, value ]) => value != null && urlParams.append(name, value));
        const response = await fetch(`${this._apiRoute}/list?${urlParams}`, {
            method: "GET"
        });

        const { isOk, data } = await handleResponse<IListProductHistoriesResponseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        return isOk ? ok(data.productHistories.map(productHistoryMapper.apiToDomain)) : err(data);
    }
}