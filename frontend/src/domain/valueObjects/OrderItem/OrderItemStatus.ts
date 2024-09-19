export default class OrderItemStatus {
    public static readonly PENDING = new OrderItemStatus('Pending');
    public static readonly FINISHED = new OrderItemStatus('Finished');

    private static readonly validStatuses = [
        OrderItemStatus.PENDING,
        OrderItemStatus.FINISHED
    ];

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string) {
        if (value === OrderItemStatus.FINISHED.value) {
            return OrderItemStatus.FINISHED;
        } else if (value === OrderItemStatus.PENDING.value) {
            return OrderItemStatus.PENDING;
        } else {
            throw new Error(`${value} is not a valid OrderItemStatus`);
        }
    }

    public static isValid(status: string): boolean {
        return OrderItemStatus.validStatuses.some(validStatus => validStatus.value === status);
    }

    public value: string;
}