import IProductApiModel from "./IProductApiModel";

export default interface IProductImageApiModel {
    id: number;
    fileName: string;
    dateCreated: Date;
    productId: IProductApiModel["id"] | null;
}
