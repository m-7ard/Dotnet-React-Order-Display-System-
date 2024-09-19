import IOrderApiModel from "./IOrderApiModel";
import IProductHistoryApiModel from "./IProductHistoryApiModel";

export default interface IOrderItemApiModel {
    id: number;
    quantity: number;
    status: string;
    dateCreated: string;
    dateFinished: string;
    orderId: IOrderApiModel["id"];
    productHistory: IProductHistoryApiModel;
}