import IProduct from "../../../../domain/models/IProduct";
import ICommand from "../../ICommand";
import IReadProductResult from "./IDeleteProductResult";

export default class DeleteProductCommand implements ICommand<IReadProductResult> {
    __returnType: IReadProductResult = null!;

    constructor(props: {
        id: IProduct["id"];
    }) {
        this.id = props.id;
    }

    public id: IProduct["id"];
}
