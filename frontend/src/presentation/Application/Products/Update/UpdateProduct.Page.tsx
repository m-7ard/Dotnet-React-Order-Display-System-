import UploadImagesForm from "../../../components/Forms/ImageUploadForm";
import StatelessCharField from "../../../components/StatelessFields/StatelessCharField";
import FormField from "../../../components/Forms/FormField";
import StatelessTextArea from "../../../components/StatelessFields/StatelessTextArea";
import MixinButton from "../../../components/Resuables/MixinButton";
import LinkBox from "../../../components/Resuables/LinkBox";
import routeData from "../../../routes/_routeData";
import { useCallback } from "react";
import { ErrorSchema, ValueSchema } from "./UpdateProduct.Controller";
import IProduct from "../../../../domain/models/IProduct";
import MixinPage, { MixinPageSection } from "../../../components/Resuables/MixinPage";
import Divider from "../../../components/Resuables/Divider";
import { CONTENT_GRID } from "../../../attribute-mixins/contentGridTracks";

export default function UpdateProductPage(props: { value: ValueSchema; onChange: (value: ValueSchema) => void; onReset: () => void; onSubmit: () => void; errors: ErrorSchema; product: IProduct; uploadImages: (images: File[]) => Promise<void> }) {
    const { value, onChange, onReset, onSubmit, errors, product, uploadImages } = props;

    const updateField = useCallback(
        <K extends keyof ValueSchema>(fieldName: K, fieldValue: ValueSchema[K]) => {
            const newValue = { ...value };
            newValue[fieldName] = fieldValue;
            onChange(newValue);
        },
        [onChange, value],
    );

    return (
        <MixinPage
            as="form"
            className={`${CONTENT_GRID.CLASS}`}
            exp={{
                size: "mixin-page-base",
            }}
            onSubmit={async (e) => {
                e.preventDefault();
                onSubmit();
            }}
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center">
                <LinkBox
                    parts={[
                        { isLink: true, to: routeData.listProducts.build({}), label: "Products" },
                        { isLink: false, label: product.id },
                        { isLink: true, to: routeData.updateProduct.build({ id: product.id }), label: "Update" },
                    ]}
                />
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col gap-3">
                <FormField name="name" errors={errors.name}>
                    <StatelessCharField
                        onChange={(value) => updateField("name", value)}
                        value={value.name}
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                    />
                </FormField>
                <FormField name="images" errors={errors.images?._}>
                    <UploadImagesForm onSubmit={uploadImages} onChange={(value) => updateField("images", value)} errors={errors.images} value={value.images} />
                </FormField>
                <FormField name="price" errors={errors.price}>
                    <StatelessCharField
                        onChange={(value) => updateField("price", value)}
                        value={value.price.toString()}
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                    />
                </FormField>
                <FormField name="description" errors={errors.description}>
                    <StatelessTextArea
                        onChange={(value) => updateField("description", value)}
                        value={value.description}
                        options={{
                            size: "mixin-textarea-any",
                            theme: "theme-textarea-generic-white",
                        }}
                        rows={5}
                        maxLength={1028}
                    />
                </FormField>
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-row gap-3 justify-end">
                <MixinButton className="  overflow-hidden" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset">
                    Reset
                </MixinButton>
                <MixinButton className="  overflow-hidden" options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                    Submit
                </MixinButton>
            </MixinPageSection>
        </MixinPage>
    );
}
