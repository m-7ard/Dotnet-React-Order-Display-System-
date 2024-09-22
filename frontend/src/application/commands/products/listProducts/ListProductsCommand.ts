import ICommand from "../../ICommand";
import IListProductsResult from "./IListProductsResult";

export default class ListProductsCommand implements ICommand<IListProductsResult> {
    __returnType: IListProductsResult = null!;

    constructor(props: {
        id: number | null;
        name: string | null;
        minPrice: number | null;
        maxPrice: number | null;
        description: string | null;
        createdBefore: Date | null;
        createdAfter: Date | null;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.minPrice = props.minPrice;
        this.maxPrice = props.maxPrice;
        this.description = props.description;
        this.createdBefore = props.createdBefore;
        this.createdAfter = props.createdAfter;
    }

    public id: number | null;
    public name: string | null;
    public minPrice: number | null;
    public maxPrice: number | null;
    public description: string | null;
    public createdBefore: Date | null;
    public createdAfter: Date | null;
}
