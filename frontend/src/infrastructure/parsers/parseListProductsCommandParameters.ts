import { Static, Type } from "@sinclair/typebox";
import parseTypeboxSchemaOrNull from "../../presentation/utils/parseTypeboxSchemaOrNull";

const schema = Type.Object({
    id: Type.Number({ minimum: 0 }),
    minPrice: Type.Number({ minimum: 0 }),
    maxPrice: Type.Number({ minimum: 0, maximum: 10 ** 6 }),
    name: Type.String({ minLength: 1 }),
    createdBefore: Type.Date(),
    createdAfter: Type.Date(),
    description: Type.String({ minLength: 1 }),
    orderBy: Type.String({ minLength: 1 }),
});

type Schema = Static<typeof schema>;

export default function parseListProductsCommandParameters(data: Partial<Record<keyof Schema, unknown>>) {
    return {
        id: parseTypeboxSchemaOrNull(schema.properties.id, data.id),
        minPrice: parseTypeboxSchemaOrNull(schema.properties.minPrice, data.minPrice),
        maxPrice: parseTypeboxSchemaOrNull(schema.properties.maxPrice, data.maxPrice),
        name: parseTypeboxSchemaOrNull(schema.properties.name, data.name),
        createdAfter: parseTypeboxSchemaOrNull(schema.properties.createdAfter, data.createdAfter),
        createdBefore: parseTypeboxSchemaOrNull(schema.properties.createdBefore, data.createdBefore),
        description: parseTypeboxSchemaOrNull(schema.properties.description, data.description),
        orderBy: parseTypeboxSchemaOrNull(schema.properties.orderBy, data.orderBy),
    }
}