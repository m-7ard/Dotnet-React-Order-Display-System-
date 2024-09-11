import IProductHistory from "../../domain/models/IProductHistory";
import IProductHistoryApiModel from "../apiModels/IProductHistoryApiModel";

const productHistoryMapper = {
    apiToDomain: (source: IProductHistoryApiModel): IProductHistory => {
        return {
            id: source.id,
            name: source.name,
            images: source.images,
            description: source.description,
            price: source.price,
            productId: source.productId,
            validFrom: source.validFrom,
            validTo: source.validTo,
        };
    },
};

export default productHistoryMapper;
