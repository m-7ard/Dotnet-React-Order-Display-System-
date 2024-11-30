import IProductHistoryApiModel from "../../../../infrastructure/apiModels/IProductHistoryApiModel";

type IListProductHistoriesResponseDTO = {
    productHistories: IProductHistoryApiModel[];
}

export default IListProductHistoriesResponseDTO; 