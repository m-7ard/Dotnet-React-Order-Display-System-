import IProductApiModel from "./IProductApiModel";

export default interface IProductImageApiModel {
    id: number;
    fileName: string;
    dateCreated: string;
    productId: IProductApiModel["id"] | null;
}
