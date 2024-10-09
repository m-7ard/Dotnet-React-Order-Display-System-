import ICommand from "../../ICommand";
import IListProductHistoriesResult from "./IListProductHistoriesResult";

export default class ListProductHistoriesCommand implements ICommand<IListProductHistoriesResult> {
    __returnType: IListProductHistoriesResult = null!;

    constructor(props: {
        name: string | null;
        minPrice: number | null;
        maxPrice: number | null;
        description: string | null;
        validFrom: Date | null;
        validTo: Date | null;
        productId: number | null;
        orderBy: string | null;
    }) {
        this.name = props.name;
        this.minPrice = props.minPrice;
        this.maxPrice = props.maxPrice;
        this.description = props.description;
        this.validFrom = props.validFrom;
        this.validTo = props.validTo;
        this.productId = props.productId;
        this.orderBy = props.orderBy;
    }

    public name: string | null;
    public minPrice: number | null;
    public maxPrice: number | null;
    public description: string | null;
    public validFrom: Date | null;
    public validTo: Date | null;
    public productId: number | null;
    public orderBy: string | null;
}
