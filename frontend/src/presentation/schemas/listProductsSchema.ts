import { Static, Type } from "@sinclair/typebox";
import parseTypeboxSchemaOrNull from "../utils/parseTypeboxSchemaOrNull";

const listProductsSchema = Type.Object({
    id: Type.Number({ minimum: 0 }),
    minPrice: Type.Number({ minimum: 0 }),
    maxPrice: Type.Number({ minimum: 0, maximum: 10 ** 6 }),
    name: Type.String({ minLength: 1 }),
    createdBefore: Type.Date(),
    createdAfter: Type.Date(),
    description: Type.String({ minLength: 1 }),
});

export function parseListProductsSchema(data: Partial<Record<keyof Static<typeof listProductsSchema>, unknown>>) {
    return {
        id: parseTypeboxSchemaOrNull(listProductsSchema.properties.id, data.id),
        minPrice: parseTypeboxSchemaOrNull(listProductsSchema.properties.minPrice, data.minPrice),
        maxPrice: parseTypeboxSchemaOrNull(listProductsSchema.properties.maxPrice, data.maxPrice),
        name: parseTypeboxSchemaOrNull(listProductsSchema.properties.name, data.name),
        createdAfter: parseTypeboxSchemaOrNull(listProductsSchema.properties.createdAfter, data.createdAfter),
        createdBefore: parseTypeboxSchemaOrNull(listProductsSchema.properties.createdBefore, data.createdBefore),
        description: parseTypeboxSchemaOrNull(listProductsSchema.properties.description, data.description),
    }
}

export default listProductsSchema;
