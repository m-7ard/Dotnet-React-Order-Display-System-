import IOrderApiModel from "../../../../infrastructure/apiModels/IOrderApiModel";

type IMarkOrderFinishedResponseDTO = {
    order: IOrderApiModel;
};

export default IMarkOrderFinishedResponseDTO;