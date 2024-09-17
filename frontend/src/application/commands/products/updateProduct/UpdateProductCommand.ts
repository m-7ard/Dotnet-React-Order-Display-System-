import IProduct from "../../../../domain/models/IProduct";
import ICommand from "../../ICommand";
import IUpdateProductResult from "./IUpdateProductResult";

export default class UpdateProductCommand implements ICommand<IUpdateProductResult> {
    __returnType: IUpdateProductResult = null!;

    
    constructor(props: {
        id: IProduct["id"],
        name: string,
        price: number,
        description: string,
        images: string[]
    }) {
        this.id = props.id
        this.name = props.name
        this.price = props.price
        this.description = props.description
        this.images = props.images
    }

    public id: IProduct["id"];
    public name: string;
    public price: number;
    public description: string;
    public images: string[];
}
