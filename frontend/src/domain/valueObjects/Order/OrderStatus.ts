export default class OrderStatus {
    public static readonly PENDING = new OrderStatus('Pending');
    public static readonly FINISHED = new OrderStatus('Finished');

    private static readonly validStatuses = [
        OrderStatus.PENDING,
        OrderStatus.FINISHED
    ];

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string) {
        if (!OrderStatus.isValid(value)) {
            throw new Error(`${value} is not a valid OrderStatus`);
        }

        return new OrderStatus(value);
    }

    public static isValid(status: string): boolean {
        return OrderStatus.validStatuses.some(validStatus => validStatus.value === status);
    }

    public value: string;
}