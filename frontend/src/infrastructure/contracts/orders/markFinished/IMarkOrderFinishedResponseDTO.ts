import IOrderApiModel from "../../../apiModels/IOrderApiModel";

type IMarkOrderFinishedResponseDTO = {
    orderId: IOrderApiModel["id"];
};

export default IMarkOrderFinishedResponseDTO;
