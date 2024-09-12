import IOrderApiModel from "./IOrderApiModel";
import IProductHistoryApiModel from "./IProductHistoryApiModel";

export default interface IOrderItemApiModel {
    id: number;
    quantity: number;
    status: {
        name: "Pending" | "Finished"
    };
    dateCreated: string;
    dateFinished: string;
    orderId: IOrderApiModel["id"];
    productHistory: IProductHistoryApiModel;
}