import { Result } from "neverthrow";
import IPlainApiError from "../IPlainApiError";
import IProductHistory from "../../../domain/models/IProductHistory";
import IListProductHistoriesRequestDTO from "../../contracts/productHistories/list/IListProductHistoriesRequestDTO";

export default interface IProductHistoryDataAccess {
    listProductHistories(request: IListProductHistoriesRequestDTO): Promise<Result<IProductHistory[], IPlainApiError>>;
}
