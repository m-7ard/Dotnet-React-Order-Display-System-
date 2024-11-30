import { FunctionComponent } from "react"
import IProduct from "../../../domain/models/IProduct"

export default function ResultsPage<T extends { product: IProduct } & Record<string, unknown>>(props: {
    ControlComponent: FunctionComponent<T>;
    results: T[];
}) {
    const { results, ControlComponent } = props;

    return (
        <section className="flex flex-col sm:grid sm:grid-cols-2 gap-x-2 gap-y-4 grow">
            {results.map((result) => (
                <ControlComponent {...result} key={result.product.id} />
            ))}
        </section>
    )
}