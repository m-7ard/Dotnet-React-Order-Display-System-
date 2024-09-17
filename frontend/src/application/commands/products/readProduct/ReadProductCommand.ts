import IProduct from "../../../../domain/models/IProduct";
import ICommand from "../../ICommand";
import IReadProductResult from "./IReadProductResult";

export default class ReadProductCommand implements ICommand<IReadProductResult> {
    __returnType: IReadProductResult = null!;

    constructor(props: {
        productId: IProduct["id"];
    }) {
        this.productId = props.productId;
    }

    public productId: IProduct["id"];
}
