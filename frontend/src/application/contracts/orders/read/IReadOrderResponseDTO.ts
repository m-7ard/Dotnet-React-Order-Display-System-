import IOrderApiModel from "../../../../infrastructure/apiModels/IOrderApiModel";

type IReadOrderResponseDTO = {
    order: IOrderApiModel;
};

export default IReadOrderResponseDTO;