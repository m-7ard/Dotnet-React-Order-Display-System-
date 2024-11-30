import IProductHistoryDataAccess from "../../application/interfaces/dataAccess/IProductHistoryDataAccess";
import IListProductHistoriesRequestDTO from "../../application/contracts/productHistories/list/IListProductHistoriesRequestDTO";
import { getApiUrl } from "../../viteUtils";

export default class ProductHistoryDataAccess implements IProductHistoryDataAccess {
    private readonly _apiRoute = `${getApiUrl()}/api/product_histories`;
    
    async listProductHistories(request: IListProductHistoriesRequestDTO): Promise<Response> {
        const urlParams = new URLSearchParams();
        Object.entries(request).forEach(([ name, value ]) => value != null && urlParams.append(name, value));
        const response = await fetch(`${this._apiRoute}/list?${urlParams}`, {
            method: "GET"
        });

        return response;
    }
}