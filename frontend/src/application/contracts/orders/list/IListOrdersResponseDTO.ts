import IOrderApiModel from "../../../../infrastructure/apiModels/IOrderApiModel";

type IListOrdersResponseDTO = {
    orders: IOrderApiModel[];
}

export default IListOrdersResponseDTO;