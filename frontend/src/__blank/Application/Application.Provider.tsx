import ExceptionService from "./Application.Provider.ExceptionService";

export default function Provider(props: React.PropsWithChildren) {
    const { children } = props;

    return (
        <ExceptionService>
            {children}
        </ExceptionService>
    )
}