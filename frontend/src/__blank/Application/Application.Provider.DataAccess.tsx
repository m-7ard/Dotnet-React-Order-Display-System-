import { productDataAccess } from "../../presentation/deps/dataAccess";
import createSafeContext from "../../presentation/utils/createSafeContext";
import ProductDataAccess from "../dataAccess/ProductDataAccess";

const [DataAccessContext, useDataAccessContext] = createSafeContext<{
    productDataAccess: ProductDataAccess
}>("");

export default function DataAccess(props: React.PropsWithChildren) {
    const { children } = props;

    return (
        <DataAccessContext.Provider value={{ productDataAccess: new ProductDataAccess() }}>
            {children}
        </DataAccessContext.Provider>
    )
}