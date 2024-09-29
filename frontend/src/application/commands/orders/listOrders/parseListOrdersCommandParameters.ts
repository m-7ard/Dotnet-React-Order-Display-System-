import { Static, Type } from "@sinclair/typebox";
import parseTypeboxSchemaOrNull from "../../../../presentation/utils/parseTypeboxSchemaOrNull";

const listOrdersSchema = Type.Object({
    id: Type.Number({ minimum: 0 }),
    minTotal: Type.Number({ minimum: 0 }),
    maxTotal: Type.Number({ minimum: 0 }),
    status: Type.String({ minLength: 1 }),
    createdBefore: Type.Date(),
    createdAfter: Type.Date(),
    productId: Type.Number({ minimum: 0 }),
    productHistoryId: Type.Number({ minimum: 0 }),
});

type Schema = Static<typeof listOrdersSchema>;
type K = keyof Schema;
type ParsedParams = {
    [key in K]: Schema[key] | null;
};

export default function parseListOrdersCommandParameters(data: Record<K, unknown>): ParsedParams {
    return {
        id: parseTypeboxSchemaOrNull(listOrdersSchema.properties.id, data.id),
        minTotal: parseTypeboxSchemaOrNull(listOrdersSchema.properties.minTotal, data.minTotal),
        maxTotal: parseTypeboxSchemaOrNull(listOrdersSchema.properties.maxTotal, data.maxTotal),
        status: parseTypeboxSchemaOrNull(listOrdersSchema.properties.status, data.status),
        createdAfter: parseTypeboxSchemaOrNull(listOrdersSchema.properties.createdAfter, data.createdAfter),
        createdBefore: parseTypeboxSchemaOrNull(listOrdersSchema.properties.createdBefore, data.createdBefore),
        productId: parseTypeboxSchemaOrNull(listOrdersSchema.properties.productId, data.productId),
        productHistoryId: parseTypeboxSchemaOrNull(listOrdersSchema.properties.productHistoryId, data.productHistoryId),
    };
}
