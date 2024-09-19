import IOrderItemApiModel from "./IOrderItemApiModel";

export default interface IOrderApiModel {
    id: number;
    total: number;
    status: string;
    dateCreated: string;
    dateFinished: string;
    orderItems: IOrderItemApiModel[];
}