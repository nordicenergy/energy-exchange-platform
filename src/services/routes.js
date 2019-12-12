import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { getToken } from './browserStorage';
import { PATHS } from '../constants';
import {
    Notifications,
    PageLoader,
    App,
    Login,
    RestorePassword,
    ResetPassword,
    Overview,
    Profile,
    FAQ,
    About,
    TermsAndConditions,
    MyProducer,
    Producer,
    BuyEnergy,
    ShowTransactions,
    MyDocuments,
    SubmitMeter,
    NotFoundPage
} from '../containers';

extendRoute(Route);

const PublicRoute = ({ component: Component, ...otherProps }) => (
    <Route
        {...otherProps}
        render={props => {
            if (getToken()) {
                return <Redirect to={PATHS.overview.path} />;
            }
            return <Component {...props} />;
        }}
    />
);

const AppMainLayout = () => {
    if (getToken()) {
        return (
            <div id="app-layout">
                <App>
                    <Switch>
                        <Route exact path={PATHS.overview.path} component={Overview} />
                        <Route exact path={PATHS.showTransactions.path} component={ShowTransactions} />
                        <Route exact path={PATHS.myProducer.path} component={MyProducer} />
                        <Route exact path={PATHS.buyEnergy.path} component={BuyEnergy} />
                        <Route exact path={PATHS.producer.path} component={Producer} />
                        <Route exact path={PATHS.documents.path} component={MyDocuments} />
                        <Route exact path={PATHS.submit_meter.path} component={SubmitMeter} />
                        <Route exact path={PATHS.profile.path} component={Profile} />
                        <Route exact path={PATHS.termsAndConditions.path} component={TermsAndConditions} />
                        <Route exact path={PATHS.about.path} component={About} />
                        <Route exact path={PATHS.faq.path} component={FAQ} />
                        <Route component={NotFoundPage} />
                    </Switch>
                </App>
            </div>
        );
    }

    return <Redirect to={`${PATHS.login.path}?next=${encodeURIComponent(window.location.pathname)}`} />;
};

export const Routes = () => (
    <div id="routes">
        <Notifications />
        <PageLoader />
        <Switch>
            <PublicRoute path={PATHS.login.path} component={Login} />
            <PublicRoute path={PATHS.restorePassword.path} component={RestorePassword} />
            <PublicRoute path={PATHS.resetPassword.path} component={ResetPassword} />
            <Route path={PATHS.overview.path} component={AppMainLayout} />
        </Switch>
    </div>
);

export function extendRoute(RouterClass) {
    const originGetChildContext = RouterClass.prototype.getChildContext;
    RouterClass.prototype.getChildContext = function() {
        const context = Reflect.apply(originGetChildContext, this, []);
        return {
            router: {
                ...context.router,
                getQueryParam(paramName = '') {
                    const { route: { location: { search } = {} } = {} } = context.router || {};
                    const params = search.substr(1).split('&');
                    for (let i = 0; i < params.length; i++) {
                        const [parameterName, value] = params[i].split('=');

                        if (parameterName === paramName && value) {
                            return decodeURIComponent(value);
                        }
                    }
                    return '';
                }
            }
        };
    };
    return RouterClass;
}
