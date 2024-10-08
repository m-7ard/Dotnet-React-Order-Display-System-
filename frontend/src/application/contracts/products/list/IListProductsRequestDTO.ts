export default interface IListProductsRequestDTO {
    id: number | null;
    name: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    description: string | null;
    createdBefore: Date | null;
    createdAfter: Date | null;
    orderBy: string | null;
}