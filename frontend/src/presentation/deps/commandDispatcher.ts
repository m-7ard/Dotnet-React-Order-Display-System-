import CommandDispatcher from "../../application/commands/CommandDispatcher";
import MarkOrderItemFinishedCommand from "../../application/commands/orderItems/markFinished/MarkOrderItemFinishedCommand";
import MarkOrderItemFinishedHandler from "../../application/commands/orderItems/markFinished/MarkOrderItemFinishedHandler";
import CreateOrderCommand from "../../application/commands/orders/createOrder/CreateOrderCommand";
import CreateOrderHandler from "../../application/commands/orders/createOrder/CreateOrderHandler";
import ListOrdersCommand from "../../application/commands/orders/listOrders/ListOrdersCommand";
import ListOrdersHandler from "../../application/commands/orders/listOrders/ListOrdersHandler";
import MarkOrderFinishedCommand from "../../application/commands/orders/markFinished/MarkOrderFinishedCommand";
import MarkOrderFinishedHandler from "../../application/commands/orders/markFinished/MarkOrderFinishedHandler";
import ReadOrderCommand from "../../application/commands/orders/readOrder/ReadOrderCommand";
import ReadOrderHandler from "../../application/commands/orders/readOrder/ReadOrderHandler";
import CreateProductCommand from "../../application/commands/products/createProduct/CreateProductCommand";
import CreateProductHandler from "../../application/commands/products/createProduct/CreateProductHandler";
import ListProductsCommand from "../../application/commands/products/listProducts/ListProductsCommand";
import ListProductsHandler from "../../application/commands/products/listProducts/ListProductsHandler";
import ReadProductHandler from "../../application/commands/products/readProduct/ReadOrdeHandler";
import ReadProductCommand from "../../application/commands/products/readProduct/ReadProductCommand";
import UploadProductImagesCommand from "../../application/commands/products/uploadProductImages/UploadProductImagesCommand";
import UploadProductImagesHandler from "../../application/commands/products/uploadProductImages/UploadProductImagesHandler";
import { orderDataAccess, productDataAccess } from "./dataAccess";
import { productStateManager } from "./stateManagers";

const commandDispatcher = new CommandDispatcher();
commandDispatcher.registerHandler(
    CreateProductCommand,
    new CreateProductHandler({
        productDataAccess: productDataAccess,
    }),
);

commandDispatcher.registerHandler(
    ListProductsCommand,
    new ListProductsHandler({
        productDataAccess: productDataAccess,
    }),
);

commandDispatcher.registerHandler(
    UploadProductImagesCommand,
    new UploadProductImagesHandler({
        productDataAccess: productDataAccess,
    }),
);

commandDispatcher.registerHandler(
    ListOrdersCommand,
    new ListOrdersHandler({
        orderDataAccess: orderDataAccess,
    }),
);

commandDispatcher.registerHandler(
    CreateOrderCommand,
    new CreateOrderHandler({
        orderDataAccess: orderDataAccess,
    }),
);

commandDispatcher.registerHandler(
    ReadOrderCommand,
    new ReadOrderHandler({
        orderDataAccess: orderDataAccess,
    }),
);

commandDispatcher.registerHandler(
    MarkOrderItemFinishedCommand,
    new MarkOrderItemFinishedHandler({
        orderDataAccess: orderDataAccess,
    }),
);

commandDispatcher.registerHandler(
    MarkOrderFinishedCommand,
    new MarkOrderFinishedHandler({
        orderDataAccess: orderDataAccess,
    }),
);

commandDispatcher.registerHandler(
    ReadProductCommand,
    new ReadProductHandler({
        productDataAccess: productDataAccess,
        productStateManager: productStateManager
    }),
);

export default commandDispatcher;
