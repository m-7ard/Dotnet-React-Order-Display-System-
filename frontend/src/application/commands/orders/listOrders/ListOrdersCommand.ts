import ICommand from "../../ICommand";
import IListOrdersResult from "./IListOrdersResult";

export default class ListOrdersCommand implements ICommand<IListOrdersResult> {
    __returnType: IListOrdersResult = null!;

    constructor(props: {
        minTotal: number | null,
        maxTotal: number | null,
        status: string | null,
        createdBefore: Date | null,
        createdAfter: Date | null,
    }) {
        this.status = props.status
        this.minTotal = props.minTotal
        this.maxTotal = props.maxTotal
        this.createdBefore = props.createdBefore
        this.createdAfter = props.createdAfter
    }

    public minTotal: number | null;
    public maxTotal: number | null;
    public status: string | null;
    public createdBefore: Date | null;
    public createdAfter: Date | null;
}
