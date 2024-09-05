import ICommand from "../../ICommand";
import IListProductsResult from "./IListProductsServiceResult";

export default class ListProductsCommand implements ICommand<IListProductsResult> {
    __returnType: IListProductsResult = null!;

    constructor(props: {
        name: string | null,
        minPrice: number | null,
        maxPrice: number | null,
        description: string | null,
        createdBefore: Date | null,
        createdAfter: Date | null,
    }) {
        this.name = props.name
        this.minPrice = props.minPrice
        this.maxPrice = props.maxPrice
        this.description = props.description
        this.createdBefore = props.createdBefore
        this.createdAfter = props.createdAfter
    }

    public name: string | null;
    public minPrice: number | null;
    public maxPrice: number | null;
    public description: string | null;
    public createdBefore: Date | null;
    public createdAfter: Date | null;
}
