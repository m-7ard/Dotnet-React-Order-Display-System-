import IOrderItemApiModel from "./IOrderItemApiModel";

export default interface IOrderApiModel {
    id: number;
    total: number;
    status: {
        name: "Pending" | "Finished"
    };
    dateCreated: string;
    dateFinished: string;
    orderItems: IOrderItemApiModel[];
}