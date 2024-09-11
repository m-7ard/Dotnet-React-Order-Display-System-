import IProductImageApiModel from "./IProductImageApiModel";

export default interface IProductApiModel {
    id: number;
    name: string;
    price: number;
    description: string;
    dateCreated: Date;
    images: IProductImageApiModel[];
}
