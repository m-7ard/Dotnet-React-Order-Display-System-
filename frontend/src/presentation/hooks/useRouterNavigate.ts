import { AbstractBaseOrdersRoute, AbstractFrontpageRoute, AbstractRoute } from "../routes/Route";

class FrontpageRoute extends AbstractFrontpageRoute {
    public build(): string {
        return "/";
    }
}

function usesTanstackRouterNavigate() {
    const tanstackRoutes = {

    }
}

function useRouterNavigate<Params extends Record<string, unknown> | undefined, Route extends AbstractRoute<Params>>({ route, params }: { route: Route, params: Params }) {
    const key = route.key;
    if ( key == null) {
        throw Error("Route must have a key");
    }


}