import IProduct from "../../../../domain/models/IProduct";
import IProductHistory from "../../../../domain/models/IProductHistory";
import Order from "../../../../domain/models/Order";
import ICommand from "../../ICommand";
import IListOrdersResult from "./IListOrdersResult";

export default class ListOrdersCommand implements ICommand<IListOrdersResult> {
    __returnType: IListOrdersResult = null!;

    constructor(props: {
        minTotal: number | null;
        maxTotal: number | null;
        status: string | null;
        createdBefore: Date | null;
        createdAfter: Date | null;
        id: Order["id"] | null;
        productId: IProduct["id"] | null;
        productHistoryId: IProductHistory["id"] | null;
    }) {
        this.status = props.status;
        this.minTotal = props.minTotal;
        this.maxTotal = props.maxTotal;
        this.createdBefore = props.createdBefore;
        this.createdAfter = props.createdAfter;
        this.id = props.id;
        this.productId = props.productId;
        this.productHistoryId = props.productHistoryId;
    }

    public minTotal: number | null;
    public maxTotal: number | null;
    public status: string | null;
    public createdBefore: Date | null;
    public createdAfter: Date | null;
    public id: Order["id"] | null;
    public productId: IProduct["id"] | null;
    public productHistoryId: IProductHistory["id"] | null;
}
