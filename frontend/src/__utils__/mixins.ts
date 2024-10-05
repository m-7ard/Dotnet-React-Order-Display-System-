import IImageData from "../domain/models/IImageData";
import IProduct from "../domain/models/IProduct";
import IProductHistory from "../domain/models/IProductHistory";
import Order from "../domain/models/Order";
import OrderItem from "../domain/models/OrderItem";
import OrderStatus from "../domain/valueObjects/Order/OrderStatus";
import OrderItemStatus from "../domain/valueObjects/OrderItem/OrderItemStatus";

export function createOrder(props: { seed: number; products: IProduct[] }): Order {
    const { seed, products } = props;

    return new Order({
        id: seed,
        total: seed,
        status: OrderStatus.PENDING,
        dateCreated: new Date(),
        dateFinished: new Date(),
        orderItems: products.map(
            (product, i) =>
                new OrderItem({
                    id: seed * 100000 + i,
                    quantity: seed,
                    status: OrderItemStatus.PENDING,
                    dateCreated: new Date(),
                    dateFinished: new Date(),
                    orderId: seed,
                    productHistory: { id: product.id, productId: product.id } as IProductHistory,
                }),
        ),
    });
}

export function createProduct(props: { seed: number; images: IImageData[] }): IProduct {
    const { seed, images } = props;

    return {
        id: seed,
        name: `product-${seed}`,
        price: seed,
        description: `product-${seed} description`,
        images: images,
        dateCreated: new Date(),
    };
}

export function createProductAndHistory(props: { seed: number; images: IImageData[] }): [IProduct, IProductHistory] {
    const { seed, images } = props;

    return [
        {
            id: seed,
            name: `product-${seed}`,
            price: seed,
            description: `product-${seed} description`,
            images: images,
            dateCreated: new Date(),
        },
        {
            id: seed,
            name: `product-${seed}`,
            price: seed,
            description: `product-${seed} description`,
            images: images.map(({ fileName }) => fileName),
            productId: seed,
            validFrom: new Date(),
            validTo: new Date(),
        },
    ];
}
