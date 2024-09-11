import IProductHistory from "./IProductHistory";

export default interface IOrderItem {
    id: number;
    quantity: number;
    status: "Pending" | "Finished";
    dateCreated: Date;
    dateFinished: Date;
    orderId: IOrderItem["id"];
    productHistory: IProductHistory;
}