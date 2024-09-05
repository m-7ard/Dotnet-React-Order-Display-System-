export default interface IListProductsRequestDTO {
    name: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    description: string | null;
    createdBefore: Date | null;
    createdAfter: Date | null;
}