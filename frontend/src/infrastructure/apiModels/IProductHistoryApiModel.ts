import IProductApiModel from "./IProductApiModel";

export default interface IProductHistoryApiModel {
    id: number;
    name: string;
    images: string[];
    description: string;
    price: number;
    productId: IProductApiModel["id"];
    validFrom: string;
    validTo: string;
}