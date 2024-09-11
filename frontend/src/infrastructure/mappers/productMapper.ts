import IProduct from "../../domain/models/IProduct";
import IProductApiModel from "../apiModels/IProductApiModel";
import productImageMapper from "./productImageMapper";

const productMapper = {
    apiToDomain: (source: IProductApiModel): IProduct => {
        return {
            id: source.id,
            name: source.name,
            price: source.price,
            description: source.description,
            dateCreated: source.dateCreated,
            images: source.images.map(productImageMapper.apiToDomain),
        };
    },
};

export default productMapper;
