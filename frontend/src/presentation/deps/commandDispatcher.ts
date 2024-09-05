import CommandDispatcher from "../../application/commands/CommandDispatcher";
import CreateProductCommand from "../../application/commands/products/createProduct/CreateProductCommand";
import CreateProductCommandHandler from "../../application/commands/products/createProduct/CreateProductCommandHandler";
import ListProductsCommand from "../../application/commands/products/listProducts/ListProductsCommand";
import ListProductsCommandHandler from "../../application/commands/products/listProducts/ListProductsCommandHandler";
import UploadProductImagesCommand from "../../application/commands/products/uploadProductImages/UploadProductImagesCommand";
import UploadProductImagesCommandHandler from "../../application/commands/products/uploadProductImages/UploadProductImagesCommandHandler";
import { productDataAccess } from "./dataAccess";
import queryClient from "./queryClient";

const commandDispatcher = new CommandDispatcher();
commandDispatcher.registerHandler(
    CreateProductCommand,
    new CreateProductCommandHandler({
        queryClient: queryClient,
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

export default commandDispatcher;
