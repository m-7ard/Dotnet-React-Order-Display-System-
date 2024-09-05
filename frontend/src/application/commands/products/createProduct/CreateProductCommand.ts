import ICommand from "../../ICommand";
import ICreateProductResult from "./ICreateProductResult";

export default class CreateProductCommand implements ICommand<ICreateProductResult> {
    __returnType: ICreateProductResult = null!;

    constructor(props: {
        name: string,
        price: number,
        description: string,
        images: string[]
    }) {
        this.name = props.name
        this.price = props.price
        this.description = props.description
        this.images = props.images
    }

    public name: string;
    public price: number;
    public description: string;
    public images: string[];
}
