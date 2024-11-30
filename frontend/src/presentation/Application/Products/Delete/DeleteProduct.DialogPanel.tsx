import IProduct from "../../../../domain/models/IProduct";
import MixinButton from "../../../components/Resuables/MixinButton";
import MixinPanel from "../../../components/Resuables/MixinPanel";
import LinkBox from "../../../components/Resuables/LinkBox";
import routeData from "../../../routes/_routeData";
import { DeleteProductErrorSchema } from "./DeleteProduct.Controller";

export default function DeleteProductDialogPanel(props: { 
    product: IProduct; 
    onSubmit: () => void;
    errors: DeleteProductErrorSchema
    onClose: () => void;
}) {
    const { product, onSubmit, errors, onClose } = props;

    return (
        <MixinPanel
            as="form"
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <header className="flex flex-row justify-between items-center">
                <LinkBox
                    parts={[
                        { isLink: true, to: routeData.listProducts.build({}), label: "Products" },
                        { isLink: false, label: "Delete" },
                    ]}
                />
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    className=" "
                    type="button"
                >
                    Close
                </MixinButton>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <section className="flex flex-col gap-2 text-sm">Do you wish to delete "{product.name}"? This Process cannot be undone</section>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <footer className="flex flex-row gap-2">
                <MixinButton onClick={onClose} className="basis-1/2 justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="button">
                    Cancel
                </MixinButton>
                <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }} type="submit">
                    Delete
                </MixinButton>
            </footer>
        </MixinPanel>
    );
}
