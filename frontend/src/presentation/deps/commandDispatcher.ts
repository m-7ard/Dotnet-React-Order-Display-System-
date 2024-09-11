import CommandDispatcher from "../../application/commands/CommandDispatcher";
import CreateOrderCommand from "../../application/commands/orders/createOrder/CreateOrderCommand";
import CreateOrderCommandHandler from "../../application/commands/orders/createOrder/CreateOrderCommandHandler";
import ListOrdersCommand from "../../application/commands/orders/listOrders/ListOrdersCommand";
import ListOrdersCommandHandler from "../../application/commands/orders/listOrders/ListOrdersCommandHandler";
import CreateProductCommand from "../../application/commands/products/createProduct/CreateProductCommand";
import CreateProductCommandHandler from "../../application/commands/products/createProduct/CreateProductCommandHandler";
import ListProductsCommand from "../../application/commands/products/listProducts/ListProductsCommand";
import ListProductsCommandHandler from "../../application/commands/products/listProducts/ListProductsCommandHandler";
import UploadProductImagesCommand from "../../application/commands/products/uploadProductImages/UploadProductImagesCommand";
import UploadProductImagesCommandHandler from "../../application/commands/products/uploadProductImages/UploadProductImagesCommandHandler";
import { orderDataAccess, productDataAccess } from "./dataAccess";

const commandDispatcher = new CommandDispatcher();
commandDispatcher.registerHandler(
    CreateProductCommand,
    new CreateProductCommandHandler({
        productDataAccess: productDataAccess,
    }),
);

commandDispatcher.registerHandler(
    ListProductsCommand,
    new ListProductsCommandHandler({
        productDataAccess: productDataAccess,
    }),
);

commandDispatcher.registerHandler(
    UploadProductImagesCommand,
    new UploadProductImagesCommandHandler({
        productDataAccess: productDataAccess,
    }),
);

commandDispatcher.registerHandler(
    ListOrdersCommand,
    new ListOrdersCommandHandler({
        orderDataAccess: orderDataAccess,
    }),
);

commandDispatcher.registerHandler(
    CreateOrderCommand,
    new CreateOrderCommandHandler({
        orderDataAccess: orderDataAccess,
    }),
);

export default commandDispatcher;
