import IImageApiModel from "./IImageApiModel";

export default interface IProductApiModel {
    id: number;
    name: string;
    price: number;
    description: string;
    dateCreated: string;
    images: IImageApiModel[];
}
