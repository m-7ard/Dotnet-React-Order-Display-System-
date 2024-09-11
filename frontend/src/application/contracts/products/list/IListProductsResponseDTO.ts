import IProductApiModel from "../../../../infrastructure/apiModels/IProductApiModel";

type IListProductsResponseDTO = {
    products: IProductApiModel[];
}

export default IListProductsResponseDTO; 