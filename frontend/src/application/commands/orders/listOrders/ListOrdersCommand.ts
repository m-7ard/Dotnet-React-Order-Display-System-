import IProduct from "../../../../domain/models/IProduct";
import Order from "../../../../domain/models/Order";
import ICommand from "../../ICommand";
import IListOrdersResult from "./IListOrdersResult";

export default class ListOrdersCommand implements ICommand<IListOrdersResult> {
    __returnType: IListOrdersResult = null!;

    constructor(props: {
        id: Order["id"] | null;
        minTotal: number | null;
        maxTotal: number | null;
        status: string | null;
        createdBefore: Date | null;
        createdAfter: Date | null;
        productId: IProduct["id"] | null;
    }) {
        this.id = props.id;
        this.status = props.status;
        this.minTotal = props.minTotal;
        this.maxTotal = props.maxTotal;
        this.createdBefore = props.createdBefore;
        this.createdAfter = props.createdAfter;
        this.productId = props.productId;
    }

    public id: Order["id"] | null;
    public minTotal: number | null;
    public maxTotal: number | null;
    public status: string | null;
    public createdBefore: Date | null;
    public createdAfter: Date | null;
    public productId: IProduct["id"] | null;
}
