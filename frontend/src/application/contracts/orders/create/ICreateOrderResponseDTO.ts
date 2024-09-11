import IOrderApiModel from "../../../../infrastructure/apiModels/IOrderApiModel";

type ICreateOrderResponseDTO = {
    order: IOrderApiModel;
};

export default ICreateOrderResponseDTO;