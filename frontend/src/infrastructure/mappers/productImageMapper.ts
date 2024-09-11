import IProductImage from "../../domain/models/IProductImage";
import IProductImageApiModel from "../apiModels/IProductImageApiModel";

const productImageMapper = {
    apiToDomain: (source: IProductImageApiModel): IProductImage => {
        return {
            id: source.id,
            fileName: source.fileName,
            dateCreated: source.dateCreated,
            productId: source.productId,
        };
    },
};

export default productImageMapper;
