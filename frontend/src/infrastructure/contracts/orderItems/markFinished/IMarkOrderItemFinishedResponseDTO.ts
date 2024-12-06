import IOrderApiModel from "../../../apiModels/IOrderApiModel";
import IOrderItemApiModel from "../../../apiModels/IOrderItemApiModel";

type IMarkOrderItemFinishedResponseDTO = {
    orderId: IOrderApiModel["id"];
    orderItemId: IOrderItemApiModel["id"];
};

export default IMarkOrderItemFinishedResponseDTO;
