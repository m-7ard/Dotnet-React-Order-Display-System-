export default interface IListOrdersRequestDTO {
    minTotal: number | null;
    maxTotal: number | null;
    status: string | null;
    createdBefore: Date | null;
    createdAfter: Date | null;
}