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
import ReadProductHandler from "../../application/commands/products/readProduct/ReadProductHandler";
import ReadProductCommand from "../../application/commands/products/readProduct/ReadProductCommand";
import UpdateProductCommand from "../../application/commands/products/updateProduct/UpdateProductCommand";
import UpdateProductHandler from "../../application/commands/products/updateProduct/UpdateProductHandler";
import UploadDraftImagesCommand from "../../application/commands/draftImages/uploadProductImages/UploadDraftImagesCommand";
import UploadDraftImagesHandler from "../../application/commands/draftImages/uploadProductImages/UploadDraftImagesHandler";
import { draftImageDataAccess, orderDataAccess, productDataAccess } from "./dataAccess";
import { productStateManager } from "./stateManagers";
import DeleteProductHandler from "../../application/commands/products/deleteProduct/DeleteProductHandler";
import DeleteProductCommand from "../../application/commands/products/deleteProduct/DeleteProductCommand";

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

commandDispatcher.registerHandler(
    UpdateProductCommand,
    new UpdateProductHandler({
        productDataAccess: productDataAccess,
    }),
);

commandDispatcher.registerHandler(
    DeleteProductCommand,
    new DeleteProductHandler({
        productDataAccess: productDataAccess,
    }),
);

commandDispatcher.registerHandler(
    UploadDraftImagesCommand,
    new UploadDraftImagesHandler({
        draftImageDataAccess: draftImageDataAccess,
    }),
);

export default commandDispatcher;
