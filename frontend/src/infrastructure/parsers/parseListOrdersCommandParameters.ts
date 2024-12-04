import { Static, Type } from "@sinclair/typebox";
import parseTypeboxSchemaOrNull from "../../presentation/utils/parseTypeboxSchemaOrNull";

const schema = Type.Object({
    id: Type.String({ minLength: 1 }),
    minTotal: Type.Number({ minimum: 0 }),
    maxTotal: Type.Number({ minimum: 0 }),
    status: Type.String({ minLength: 1 }),
    createdBefore: Type.Date(),
    createdAfter: Type.Date(),
    productId: Type.Number({ minimum: 0 }),
    productHistoryId: Type.Number({ minimum: 0 }),
    orderBy: Type.String({ minLength: 1 }),
});

type Schema = Static<typeof schema>;

export default function parseListOrdersCommandParameters(data: Partial<Record<keyof Schema, unknown>>) {
    return {
        id: parseTypeboxSchemaOrNull(schema.properties.id, data.id),
        minTotal: parseTypeboxSchemaOrNull(schema.properties.minTotal, data.minTotal),
        maxTotal: parseTypeboxSchemaOrNull(schema.properties.maxTotal, data.maxTotal),
        status: parseTypeboxSchemaOrNull(schema.properties.status, data.status),
        createdAfter: parseTypeboxSchemaOrNull(schema.properties.createdAfter, data.createdAfter),
        createdBefore: parseTypeboxSchemaOrNull(schema.properties.createdBefore, data.createdBefore),
        productId: parseTypeboxSchemaOrNull(schema.properties.productId, data.productId),
        productHistoryId: parseTypeboxSchemaOrNull(schema.properties.productHistoryId, data.productHistoryId),
        orderBy: parseTypeboxSchemaOrNull(schema.properties.orderBy, data.orderBy),
    };
}